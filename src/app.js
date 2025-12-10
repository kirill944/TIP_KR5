const express = require('express');
const path = require('path');
const eventRoutes = require('./routes/events');
const { requestLogger } = require('./middleware/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/api/events', eventRoutes);

// Основной маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        path: req.path
    });
});

module.exports = app;