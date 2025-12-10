const fs = require('fs').promises;
const path = require('path');

const eventsFilePath = path.join(__dirname, '../data/events.json');

// Чтение данных из файла
const readEventsData = async () => {
    try {
        const data = await fs.readFile(eventsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { events: [] };
    }
};

// Запись данных в файл
const writeEventsData = async (data) => {
    await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Получить все события
const getAllEvents = async (req, res) => {
    try {
        const { category, sort = 'date' } = req.query;
        const data = await readEventsData();
        let events = data.events;

        // Фильтрация по категории
        if (category) {
            events = events.filter(event =>
                event.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Сортировка
        if (sort === 'date') {
            events.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === 'title') {
            events.sort((a, b) => a.title.localeCompare(b.title));
        }

        res.json({
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить событие по ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readEventsData();
        const event = data.events.find(e => e.id === parseInt(id));

        if (!event) {
            return res.status(404).json({ error: 'Событие не найдено' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить события по категории
const getEventsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const data = await readEventsData();
        const events = data.events.filter(event =>
            event.category.toLowerCase() === category.toLowerCase()
        );

        res.json({
            category,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать новое событие
const createEvent = async (req, res) => {
    try {
        const { title, description, date, category, location } = req.body;

        if (!title || !date || !category) {
            return res.status(400).json({
                error: 'Обязательные поля: title, date, category'
            });
        }

        const data = await readEventsData();
        const newEvent = {
            id: data.events.length > 0 ? Math.max(...data.events.map(e => e.id)) + 1 : 1,
            title,
            description: description || '',
            date: new Date(date).toISOString(),
            category,
            location: location || 'Не указано',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.events.push(newEvent);
        await writeEventsData(data);

        res.status(201).json({
            message: 'Событие создано',
            event: newEvent
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить событие
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const data = await readEventsData();
        const eventIndex = data.events.findIndex(e => e.id === parseInt(id));

        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Событие не найдено' });
        }

        const updatedEvent = {
            ...data.events[eventIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
            id: parseInt(id) // Защищаем ID от изменения
        };

        data.events[eventIndex] = updatedEvent;
        await writeEventsData(data);

        res.json({
            message: 'Событие обновлено',
            event: updatedEvent
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить событие
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readEventsData();
        const eventIndex = data.events.findIndex(e => e.id === parseInt(id));

        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Событие не найдено' });
        }

        const deletedEvent = data.events.splice(eventIndex, 1)[0];
        await writeEventsData(data);

        res.json({
            message: 'Событие удалено',
            event: deletedEvent
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByCategory
};