const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // si usás Node <18

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generar-arbol', async (req, res) => {
  const { texto } = req.body;

  const prompt = `
Dado el siguiente texto:
"${texto}"
Genera un árbol mental en formato JSON. 
Cada nodo debe tener "nombre" y, si aplica, un array de "hijos". 
Usa claves simples: nombre, hijos. No agregues explicaciones.

Ejemplo de formato:
{
  "nombre": "Productividad",
  "hijos": [
    {
      "nombre": "Hábitos",
      "hijos": [
        { "nombre": "Mañana" },
        { "nombre": "Noche" }
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

    const data = await response.json();

    const match = data.response.match(/\{[\s\S]*\}/);
    const jsonOutput = match ? JSON.parse(match[0]) : null;

    res.json({ arbol: jsonOutput });
  } catch (error) {
    console.error('Error generando árbol:', error);
    res.status(500).json({ error: 'Error generando árbol mental' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
