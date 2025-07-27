"use client";
import MainForm from '../components/MainForm';
import TreeDiagram from "@/components/d3Components/TreeDiagram";
import {useState} from 'react';
import { TreeNode } from '@/components/d3Components/TreeDiagram';

export default function Home() {
  const [treeData,setTreeData] = useState<TreeNode | null>(null);

  const plantillaJSON = {
    nombre: "Aprender JavaScript",
    shortInfo: "Domina la programación con este lenguaje de código.",
    hijos: [
      {
        nombre: "Fundamentos",
        shortInfo: "Entender los conceptos básicos y estructuras del lenguaje.",
        hijos: [
          {
            nombre: "Variables y Tipos",
            shortInfo: "Comprender la declaración de variables y su tipo en JavaScript."
          },
          {
            nombre: "Tipos de Dato",
            shortInfo: "Entender los diferentes tipos de datos primitivos y objetos en JavaScript."
          }
        ]
      },
      {
        nombre: "Control de Flujo",
        shortInfo: "Aprender a controlar el flujo de ejecución con sentencias condicionales.",
        hijos: [
          {
            nombre: "Condicionales",
            shortInfo: "Entender la estructura de las sentencias if y else."
          },
          {
            nombre: "Bucles y Sentencias",
            shortInfo: "Aprender a utilizar bucles for, while y do-while para controlar el flujo de ejecución."
          }
        ]
      },
      {
        nombre: "Funciones y Objetos",
        shortInfo: "Aprender a crear funciones y objetos en JavaScript.",
        hijos: [
          {
            nombre: "Funciones",
            shortInfo: "Entender la creación de funciones puras y impuras en JavaScript."
          },
          {
            nombre: "Objetos y Propiedades",
            shortInfo: "Aprender a crear objetos y asignar propiedades en JavaScript."
          }
        ]
      },
      {
        nombre: "Herramientas y Prácticas",
        shortInfo: "Domina las herramientas y prácticas comunes para el desarrollo con JavaScript.",
        hijos: [
          {
            nombre: "Consola y Debugging",
            shortInfo: "Aprender a utilizar la consola y técnicas de depuración en JavaScript."
          },
          {
            nombre: "Herramientas para Desarrollo",
            shortInfo: "Entender las herramientas comunes como Node.js, npm y Browserify."
          }
        ]
      }
    ]
  }

  

  return (
    // <div className="overflow-visible relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
      {/* <main className="overflow-visible relative flex flex-col gap-[32px] row-start-2 items-center sm:items-start"> */}
      <main>
        <MainForm setTreeData={setTreeData}/>
        {/* si hay datos, renderizo el árbol */}
        {/* {
          treeData?(
            <TreeDiagram data={treeData}/>
          ):(
            <p className="text-gray-500">Cargando árbol...</p>
          )
        } */}
        {/* prueba estática para acomodar el árbol */}
        <TreeDiagram data={plantillaJSON}/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
