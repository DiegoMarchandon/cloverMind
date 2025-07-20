"use client";
import MainForm from '../components/MainForm';
import TreeDiagram from "@/components/d3Components/TreeDiagram";
import {useState} from 'react';
import { TreeNode } from '@/components/d3Components/TreeDiagram';

export default function Home() {
  const [treeData,setTreeData] = useState<TreeNode | null>(null);

  /* const plantillaJSON = {
    "nombre": "Aprender JavaScript",
    "hijos": [
      {
        "nombre": "Introducción",
        "hijos": [
          { "nombre": "Qué es JavaScript", "hijos": [] },
          { "nombre": "Historia y evolución", "hijos": [] }
        ]
      },
      {
        "nombre": "Conceptos Básicos",
        "hijos": [
          {
            "nombre": "Variables y tipos de datos",
            "hijos": [
              { "nombre": "Primitivos (string, number, boolean)" },
              { "nombre": "Referenciados (array, object, function)" }
            ]
          },
          {
            "nombre": "Operadores y estructuras de control",
            "hijos": [
              { "nombre": "Condicionales (if/else, switch)" },
              { "nombre": "Iteraciones (for, while, do-while)" }
            ]
          },
          {
            "nombre": "Funciones y modularidad",
            "hijos": [
              { "nombre": "Definición de funciones" },
              { "nombre": "Uso de callbacks y closures" }
            ]
          }
        ]
      },
      {
        "nombre": "Semántica y Best Practices",
        "hijos": [
          { "nombre": "Variables y scopes", "hijos": [] },
          { "nombre": "Uso de comments y documentation", "hijos": [] }
        ]
      },
      {
        "nombre": "Avanzados",
        "hijos": [
          { "nombre": "Manipulación del DOM (Document Object Model)", "hijos": [] },
          { "nombre": "Uso de bibliotecas y frameworks (React, Angular, Vue.js)", "hijos": [] }
        ]
      },
      {
        "nombre": "Herramientas Comunes",
        "hijos": [
          { "nombre": "Editores y IDEs (Visual Studio Code, IntelliJ IDEA)" },
          { "nombre": "Bibliotecas y módulos (Lodash, jQuery)" }
        ]
      }
    ]
  } */
  

  return (
    // <div className="overflow-visible relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
      {/* <main className="overflow-visible relative flex flex-col gap-[32px] row-start-2 items-center sm:items-start"> */}
      <main>
        <MainForm setTreeData={setTreeData}/>
        {/* si hay datos, renderizo el árbol */}
        {
          treeData?(
            <TreeDiagram data={treeData}/>
          ):(
            <p className="text-gray-500">Cargando árbol...</p>
          )
        }
        {/* prueba estática para acomodar el árbol */}
        {/* <TreeDiagram data={plantillaJSON}/> */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
