import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { texto } = req.body;
  console.log('Texto recibido:', req.body.texto);
  const prompt = `
  Dado el siguiente texto: "${texto}"

Genera un árbol mental en formato JSON.  
El árbol debe tener al menos tres niveles de profundidad.  
Cada nodo debe tener:
- Un campo 'nombre' con un título claro.
- Un campo 'shortInfo' con una breve descripción de ese nodo (1 o 2 líneas).
- Un array 'hijos', con nombres específicos y variados.

Evitar términos genéricos como 'introducción', 'especialidad', 'conceptos básicos', 'semántica', etc.,  
Y en caso de usarlos, especificar lo que abarcan en los nodos hijos.

Incluí temas avanzados, buenas prácticas y herramientas comunes si aplica.

Ejemplo de formato:

{
  "nombre": "Productividad",
  "shortInfo": "Técnicas y hábitos para optimizar el tiempo y energía.",
  "hijos": [
    {
      "nombre": "Hábitos",
      "shortInfo": "Acciones repetidas que afectan la productividad diaria.",
      "hijos": [
        { "nombre": "Mañana", "shortInfo": "Rutinas al iniciar el día que aumentan el foco." },
        { "nombre": "Noche", "shortInfo": "Hábitos para cerrar el día y mejorar el descanso." }
      ]
    }
  ]
}`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false
      })
    });
    const text = await response.text();
    
    
    console.log("respuesta cruda de Ollama: ",text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Error al parsear JSON:", e);
      return res.status(500).json({ error: 'Respuesta no válida de Ollama' });
    }

    const match = data.response.match(/\{[\s\S]*\}/);
    const jsonOutput = match ? JSON.parse(match[0]) : null;

    res.json({ arbol: jsonOutput }); //retorno una respuesta JSON
  } catch (error) {
    console.error('Error generando árbol:', error);
    res.status(500).json({ error: 'Error generando árbol mental' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
