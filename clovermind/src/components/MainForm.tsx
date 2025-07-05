import Head from 'next/head'

export default function MainForm() {
  return (
    <>
      <Head>
        <title>CloverMind - Inicio</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <form className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-sm text-black">
          <h1 className="text-2xl font-bold text-center">Formulario básico</h1>

          <div>
            <label className="block mb-1 text-sm font-medium">Prompt</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describí tu árbol"
              pattern="([A-Za-zÁÉÍÓÚáéíóúÑñ\d])+(\s?)"
              minLength={3}
              maxLength={150}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Generar Diagrama
          </button>
        </form>
      </main>
    </>
  )
}
