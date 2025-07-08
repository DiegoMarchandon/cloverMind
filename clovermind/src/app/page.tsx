"use client";
import Image from "next/image";
import MainForm from '../components/MainForm';
import TreeDiagram from "@/components/d3Components/TreeDiagram";
import {useState} from 'react';

export default function Home() {
  const [treeData,setTreeData] = useState(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <MainForm setTreeData={setTreeData}/>
        {/* si hay datos, renderizo el árbol */}
        {
          treeData?(
            <TreeDiagram data={treeData}/>
          ):(
            <p className="text-gray-500">Cargando árbol...</p>
          )
        }
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Footer Content</p>
      </footer>
    </div>
  );
}
