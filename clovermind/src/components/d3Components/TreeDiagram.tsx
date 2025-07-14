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
  
  // const drag = d3.drag<SVGGElement,any>();
  const drag = d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>, unknown>();


  useEffect(() => {
    if (!data || !svgRef.current) return;


    // acá renderizo el árbol con D3
    const width = 500;
    const dx = 60; //espaciado vertical entre niveles/separación radial
    const dy = width; //centra el SVG
    // const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    
    // 2) conversión de coordenadas polares a cartesianas con función project
    function project(x: number, y: number):[number,number] { //<-- esta función devolverá un array con exactamente dos valores numéricos
      return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
    }

    function transformarEstructura(nodo: any): any { // <-- devuelve cualquier tipo
      return {
        ...nodo,
        children: nodo.hijos?.map(transformarEstructura)
      };
    }

    const root = d3.hierarchy(transformarEstructura(data));
    // const height = Math.max(400, dx * (root.height + 2)); // asegura mínimo de 200px

    //1) coordenadas polares:
    // const radius = width / 2;
    const radius = dx * (root.height +4);
    // distribución de los nodos en el círculo / separación angular entre nodos
    const tree = d3.tree<TreeNode>().size([2 * Math.PI,radius*2]);

    const treeData = tree(root); // <- Esto produce HierarchyPointNode (coordenadas .x e .y)

    const links = treeData.links(); // <- Esto produce HierarchyPointLink

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove(); // Limpia SVG previo antes de renderizar
    svg
      .attr('viewBox',[radius/5,-radius,radius*5,radius*4]) //x, y, width, height; coordenadas del lienzo
      .attr('font-family', 'sans-serif')
      .attr('font-size', 8);

    const g = svg.append('g').attr('transform', `translate(${dy * 2}, ${dx*5})`); //grupo que centra el árbol

    // Enlaces (lineas; conexiones entre nodos)
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
      const text = node
      .append('text')
      .text(d => d.data.nombre)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 15)
      .attr('pointer-events','none');
    
    // estilos al nodo raíz
      text
    .filter(d => d.depth === 0)
    .attr('fill', 'white')
    .attr('font-weight', 'bold')
    .attr('font-size', 30);

    // Luego de agregar el texto, insertás el rect
    node.each(function (d) {
      const group = d3.select(this);
      const txt = group.select('text');
      const bbox = (txt.node() as SVGTextElement).getBBox();
      const paddingX = 6;
      const paddingY = 4;
    
      const rect = group
        .insert('rect', 'text') // insertarlo antes del texto
        .attr('x', bbox.x - paddingX)
        .attr('y', bbox.y - paddingY)
        .attr('width', bbox.width + 2 * paddingX)
        .attr('height', bbox.height + 2 * paddingY)
        .attr('rx', 10) // bordes redondeados opcionales
        .attr('fill', '#999')
        .attr('stroke', '#222')
        .attr('stroke-width', 0.5);
        // .attr('pointer-events','none');
      
      // estilos del nodo raíz
      if(d.depth === 0){
        rect
        .attr('fill', '#999')
        .attr('stroke', '#f00')
        .attr('stroke-width', 4.5);
        // .attr('pointer-events','none');
      }
    });
    
    // acá defino el comportamiento drag
  
    // 1) creo función started
    /**
     * @param SVGGElement this
     * @param D3DragEvent event
     * @param any d
     * función que recibe el SVG, el evento Drag y el dato asociado al nodo que se arrastra (<g> en cuestión)
     */
    function started(this: SVGGElement,event: d3.D3DragEvent<SVGGElement,d3.HierarchyPointNode<TreeNode>, unknown>, d: d3.HierarchyPointNode<TreeNode>){
      // efecto visual para cambiar estilos al elemento arrastrado
      d3.select(this)
      .raise()
      .attr("stroke","orange");
      console.log("drag iniciado");
      const [nodeX, nodeY] = project(d.x!, d.y!);
      const offsetX = event.x - nodeX;
      const offsetY = event.y - nodeY;
  
      // eventos posteriores 
      event.on("drag",function(event: any){
        d3.select(this as SVGGElement)
        .attr('transform',
          `translate(${event.x-offsetX},${event.y-offsetY})`
        );
      }).on("end",function(){
        d3.select(this as SVGGElement).attr("stroke",null)
      });
    }

    //   (node as d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, any, any>)
    // .call(drag)
    // .on("start", started);
    node.call(
      d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>>()
        .on("start", started)
    );
  
  }, [data]);


  return (
    <div className="overflow-auto bg-white">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
