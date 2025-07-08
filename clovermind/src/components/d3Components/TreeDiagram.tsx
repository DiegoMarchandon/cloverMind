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
    const dy = width / 4;
    // const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);

    //1) coordenadas polares:
    const radius = width / 2;
    const tree = d3.tree<TreeNode>().size([2 * Math.PI,radius]);

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

    const height = Math.max(300, dx * (root.height + 4)); // asegura mínimo de 200px

    // 2) conversión de coordenadas polares a cartesianas con función project
    function project(x: number, y: number) {
      return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
    }

    svg.selectAll('*').remove(); // Limpia SVG previo antes de renderizar
    svg
      .attr('viewBox', [-dy/2, -dx, width, height])
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
        /* d3
          .linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.x)
          .y(d => d.y) */
        d => {
          const [sx, sy] = project(d.source.x, d.source.y);
          const [tx, ty] = project(d.target.x, d.target.y);
          return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
        }
      );
      

    // Nodos (círculos + texto)
    const node = g
      .append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      // .attr('transform', (d: any) => `translate(${d.y},${d.x})`);
      .attr('transform', d => {
        const [x, y] = project(d.x!, d.y!);
        return `translate(${x},${y})`;
      });
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
