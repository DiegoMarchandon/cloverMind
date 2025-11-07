"use client";
import Head from 'next/head';
import { useRef } from 'react';
import { TreeNode } from './d3Components/TreeDiagram';

type MainFormProps = {
  setTreeData: (data:TreeNode | null) => void;
};

export default function MainForm({setTreeData}:MainFormProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textoUsuario = inputRef.current?.value || '';
    console.log(textoUsuario);
    fetch('http://localhost:3001/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({texto:textoUsuario})
    })
    .then(res => res.json())
    .then(data => {
      console.log('Árbol generado: ',data.arbol);
      setTreeData(data.arbol); //actualizo el estado en page.tsx
    })
  }
  return (
    <>
      <Head>
        <title>CloverMind - Inicio</title>
      </Head>
      <main className="relative min-h-screen flex items-center justify-center bg-gray-800">
        <form className="relative bg-gray-900 p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm text-white border-2 border-cyan-400 shadow-[0_0_15px_cyan] transition" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-center text-cyan-400">Formulario básico</h1>

          <div>
            <label className="block mb-1 text-sm font-medium text-cyan-300">Prompt</label>
            <input
            ref={inputRef}
            id='inputTexto'
              type="text"
              className="w-full bg-transparent border border-cyan-400 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-500"
              placeholder="Describí tu árbol"
              pattern="([A-Za-zÁÉÍÓÚáéíóúÑñ\d]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ\d]+)*)"
              minLength={3}
              maxLength={150}
              required
            />
          </div>

          <div className="relative group">
            <button
              type="submit"
              className="group w-full relative bg-cyan-500 text-black font-semibold py-2 px-4 rounded hover:bg-pink-500 transition shadow-[0_0_10px_cyan] hover:shadow-[0_0_15px_pink]"
            >
              Generar Diagrama
            </button>
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-80px] w-[85%] h-10 opacity-40 blur-2xl transition-all duration-300 shadow-[0_0_50px_cyan] bg-cyan-400 group-hover:bg-pink-400 group-hover:blur-xl pointer-events-none"
              style={{
                // background: 'linear-gradient(to bottom,rgba(34, 238, 228, 0.85) 0%,rgba(34, 238, 228, 0.84) 20%,#000000 40%,#000000 100%)',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              }}
            >    
            </div>
          </div>
          
        </form>
      </main>
    </>
  )
}
