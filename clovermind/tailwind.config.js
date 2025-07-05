/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos en src con estas extensiones
    "./public/**/*.html",        // Opcional: incluye archivos HTML en public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

