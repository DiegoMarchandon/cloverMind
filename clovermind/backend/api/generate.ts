import express, { Request, Response} from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';

const app = express();
app.use(express.json());
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.post('/api/generate', (req: Request, res: Response) => {
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
});
export default app;