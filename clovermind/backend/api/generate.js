"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import bodyParser from 'body-parser';
// import cors from 'cors';
var app = (0, express_1.default)();
app.use(express_1.default.json());
var PORT = 3001;
app.listen(PORT, function () {
    console.log("Servidor escuchando en http://localhost:".concat(PORT));
});
app.post('/api/generate', function (req, res) {
    try {
        var _a = req.body, model = _a.model, prompt_1 = _a.prompt, stream = _a.stream;
        // Simula una respuesta JSON
        var simulatedResponse = {
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
    }
    catch (error) {
        console.error('Error en /api/generate: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = app;
