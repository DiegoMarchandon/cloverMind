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
//   const prompt = `

// Genera un JSON válido para un árbol mendal sobre: ${texto}.  
// El árbol debe tener cinco niveles de profundidad.  
// Cada nodo debe tener:
// - Un campo 'nombre' con un título claro.
// - Un campo 'shortInfo' con una breve descripción de ese nodo (1 o 2 líneas).
// - Un array 'hijos', con nombres concretos relacionados a áreas, temas o técnicas específicas.

// Si se mencionan términos genéricos como 'introducción', 'especialidad', 'conceptos básicos', 'semántica', etc., 
// especificar lo que abarcan en los nodos hijos.
// Incluí temas avanzados como técnicas, metodologías, herramientas, frameworks, buenas prácticas y  bibliotecas si aplica.

// Ejemplo de formato:

// {
//   "nombre": "Productividad",
//   "shortInfo": "Técnicas y hábitos para optimizar el tiempo y energía.",
//   "hijos": [
//     {
//       "nombre": "Hábitos",
//       "shortInfo": "Acciones repetidas que afectan la productividad diaria.",
//       "hijos": [
//         { "nombre": "Mañana", "shortInfo": "Rutinas al iniciar el día que aumentan el foco." },
//         { "nombre": "Noche", "shortInfo": "Hábitos para cerrar el día y mejorar el descanso." }
//       ]
//     }
//   ]
// }`;
const prompt = `Genera SOLAMENTE un JSON válido para un árbol mental sobre "${texto}".
Máximo 3 niveles de profundidad y 3-4 hijos por nodo.

Formato EXCLUSIVO:
{
  "nombre": "string",
  "shortInfo": "string", 
  "hijos": []
}

RESPONDE ÚNICAMENTE CON EL JSON, sin texto adicional.`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // menor variabilidad,
          num_predict: 1200, // limite de tokens
          top_k: 30,
          top_p: 0.8
        }
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
    if(!match){
      console.error("No se pudo extraer JSON de: ",data.response);
      return res.status(500).json({ error: 'no se pudo generar JSON válido.' });
    }

    // Después de recibir la respuesta
    console.log("Respuesta completa:", data.response);

    // Limpia la respuesta antes de parsear
    const cleanResponse = data.response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonOutput = JSON.parse(cleanResponse);
    res.json({ arbol: jsonOutput }); //retorno una respuesta JSON
  } catch (error) {
    console.error('Error JSON inválido. Raw:', cleanResponse);
    res.status(500).json({ error: 'Error generando árbol mental',partial:cleanResponse });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
