const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByCategory
} = require('../controllers/eventController');

// GET /api/events - все события
router.get('/', getAllEvents);

// GET /api/events/category/:category - события по категории
router.get('/category/:category', getEventsByCategory);

// GET /api/events/:id - одно событие по ID
router.get('/:id', getEventById);

// POST /api/events - создать событие
router.post('/', createEvent);

// PUT /api/events/:id - обновить событие
router.put('/:id', updateEvent);

// DELETE /api/events/:id - удалить событие
router.delete('/:id', deleteEvent);

module.exports = router;