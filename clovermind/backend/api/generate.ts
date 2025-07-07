import express, { Request, Response} from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';

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
        nombre: "Productividad",
        hijos: [
          {
            nombre: "Hábitos",
            hijos: [
              { nombre: "Mañana" },
              { nombre: "Noche" }
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