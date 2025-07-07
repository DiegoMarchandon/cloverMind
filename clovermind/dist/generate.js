"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from 'body-parser';
// import cors from 'cors';
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
app.post('/api/generate', (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Error en /api/generate: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = app;
