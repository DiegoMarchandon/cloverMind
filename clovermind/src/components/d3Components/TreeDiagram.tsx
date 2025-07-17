'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export type TreeNode = {
  nombre: string;
  hijos?: TreeNode[];
  children?:TreeNode[];
};

type TreeDiagramProps = {
  data: TreeNode;
};

export default function TreeDiagram({ data }: TreeDiagramProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // const drag = d3.drag<SVGGElement,any>();
  // const drag = d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>, unknown>();


  useEffect(() => {
    if (!data || !svgRef.current) return;


    // acá renderizo el árbol con D3
    const width = 500;
    const dx = 60; //espaciado vertical entre niveles/separación radial
    const dy = width; //centra el SVG

    // 2) conversión de coordenadas polares a cartesianas con función project
    function project(x: number, y: number):[number,number] { //<-- esta función devolverá un array con exactamente dos valores numéricos
      return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
    }

    function transformarEstructura(nodo: TreeNode): TreeNode { // <-- devuelve cualquier tipo
      return {
        ...nodo,
        children: nodo.hijos?.map(transformarEstructura)
      };
    }

    const root = d3.hierarchy(transformarEstructura(data));
    // const height = Math.max(400, dx * (root.height + 2)); // asegura mínimo de 200px

    //1) coordenadas polares:

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
    const defs = svg.append('defs');
    defs.append('filter')
      .attr('id', 'shadow')
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 14)
      .attr('stdDeviation', 3)
      .attr('flood-color', '#3b82f6') // equivalente a blue-500
      .attr('flood-opacity', 0.5);
    
    g.append('g')
      .attr('filter', 'url(#shadow)')
      .attr('fill', 'none')
      .attr('stroke', '#0ff')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 3.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', d => {
        const [sx, sy] = project(d.source.x, d.source.y);
        const [tx, ty] = project(d.target.x, d.target.y);
        return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
      });
    

    // Nodos (círculos + texto)
    const node = g
      .append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => {
        const [x, y] = project(d.x!, d.y!);
        return `translate(${x},${y})`;
      });
      const text = node
      .append('text')
      .text(d => d.data.nombre)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'cyan')
      .attr('font-size', 20)
      .attr('pointer-events','none');
    
    // estilos al nodo raíz
      text
    .filter(d => d.depth === 0)
    .attr('fill', 'cyan')
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
        .attr('fill', '#333')
        .attr('stroke', '#0FF')
        .attr('stroke-width', 1.7);
      
      // estilos del nodo raíz
      if(d.depth === 0){
        rect
        .attr('fill', '#999')
        .attr('stroke', '#0ff')
        .attr('stroke-width', 4.5);

      }
    });
    
    // acá defino el comportamiento drag
  
    // 2) creo la función para actualizar los links
    function updateLinks() {
      g.selectAll('path')
        .data(links)
        .attr('d', d => {
          const [sx, sy] = project(d.source.x, d.source.y);
          const [tx, ty] = project(d.target.x, d.target.y);
          return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
        });
    }
    
    // evento zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 3]) // zoom mínimo y máximo
    .on("zoom", (event) => {
      g.attr("transform", event.transform); // aplica zoom y pan al grupo g
    });

  d3.select(svgRef.current).call(zoom);



    // 1) creo función started
    /**
     * @param SVGGElement this
     * @param D3DragEvent event
     * @param any d
     * función que recibe el SVG, el evento Drag y el dato asociado al nodo que se arrastra (<g> en cuestión)
     */
    function started(this: SVGGElement,event: d3.D3DragEvent<SVGGElement,d3.HierarchyPointNode<TreeNode>, unknown>, d: d3.HierarchyPointNode<TreeNode>){
      // efecto visual para cambiar estilos al elemento arrastrado
      d3.select(this).select('rect')
      .attr('fill', '#0ff');

      d3.select(this)
      .raise()
      .attr('stroke', 'black');

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
        d.x = Math.atan2(event.y - offsetY, event.x - offsetX) + Math.PI / 2;
        d.y = Math.sqrt((event.x - offsetX) ** 2 + (event.y - offsetY) ** 2);
        updateLinks();
      }).on("end",function(){
        d3.select(this as SVGGElement)
        .attr("stroke",null);

        d3.select(this).select('rect')
        .attr('fill', '#333');
      });
    }

    node.call(
      d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>>()
        .on("start", started)
    );

  }, [data]);


  return (
    <div className="overflow-auto bg-black">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
