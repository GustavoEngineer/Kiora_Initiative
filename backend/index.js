const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Import routes
const routes = require('./src/routes');

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server configuration
const PORT = process.env.PORT || 3000;

// SOLO ejecutamos el listen si NO estamos en producción (o sea, en local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor local corriendo en http://localhost:${PORT}`);
        console.log(`CORS permitido para: ${allowedOrigin}`);
    });
}

// Para Vercel, esto es lo que realmente importa:
module.exports = app;