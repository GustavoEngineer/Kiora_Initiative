const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares Globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://kiora-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Main Route (Health check)
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Routes
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;
