'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type TreeNode = {
  nombre: string;
  hijos?: TreeNode[];
};

type TreeDiagramProps = {
  data: TreeNode;
};

export default function TreeDiagram({ data }: TreeDiagramProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // acá renderizo el árbol con D3
    const width = 600;
    const dx = 20;
    const dy = width / 6;
    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    
    function transformarEstructura(nodo: any): any {
      return {
        ...nodo,
        children: nodo.hijos?.map(transformarEstructura)
      };
    }

    const root = d3.hierarchy(transformarEstructura(data));
    const treeData = tree(root); // <- Esto produce HierarchyPointNode (coordenadas .x e .y)

    const links = treeData.links(); // <- Esto produce HierarchyPointLink

    const svg = d3.select(svgRef.current);

    const height = Math.max(200, dx * (root.height + 2)); // asegura mínimo de 200px

    svg.selectAll('*').remove(); // Limpia SVG previo antes de renderizar
    svg
      .attr('viewBox', [-dy / 2, -dx, width, height])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12);

    const g = svg.append('g').attr('transform', `translate(${dy / 2}, ${dx})`);

    // Enlaces (líneas)
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr(
        'd',
        d3
          .linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.x)
          .y(d => d.y)
      );
      

    // Nodos (círculos + texto)
    const node = g
      .append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('fill', d => (d.children ? '#555' : '#999'))
      .attr('r', 4);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', d => (d.children ? -6 : 6))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data.nombre)
      .clone(true)
      .lower()
      .attr('stroke', 'white');
  }, [data]);

  return (
    <div className="overflow-auto">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
