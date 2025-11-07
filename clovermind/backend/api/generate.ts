import express, { Request, Response} from 'express';

const app = express();
app.use(express.json());
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.post('/api/generate', (req: Request<{}, {}, { model: string; prompt: string; stream: boolean }>, res: Response) => {
  try{

    const { model, prompt, stream } = req.body;
  
    // Simula una respuesta JSON
    const simulatedResponse = {
      response: JSON.stringify({
        "nombre": "Productividad",
        "shortInfo": "Técnicas para mejorar el rendimiento personal y profesional.",
        "hijos": [
          {
            "nombre": "Hábitos",
            "shortInfo": "Conductas diarias que influyen en la productividad.",
            "hijos": [
              { "nombre": "Mañana", "shortInfo": "Rutinas para comenzar el día con energía.", "hijos": [] },
              { "nombre": "Noche", "shortInfo": "Acciones que ayudan a cerrar el día y descansar bien.", "hijos": [] }
            ]
          }
        ]
      })
    };
  
    res.json(simulatedResponse);
  } catch(error){
    console.error('Error en /api/generate: ',error);
    res.status(500).json({error: 'Error interno del servidor'});
  }
});
export default app;