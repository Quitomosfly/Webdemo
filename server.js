const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data

// MongoDB Compass Connection (Localhost)
mongoose.connect('mongodb://localhost:27017/eventsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully (Compass)'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Event Schema
const eventSchema = new mongoose.Schema({
    eventName: String,
    scheduleType: String,
    selectedDates: [String],
    selectedDays: [String],
    timeRange: String
});

const Event = mongoose.model('Event', eventSchema);

// Route to handle form submission
app.post('/submit-event', async (req, res) => {
    const { 
        eventName, 
        scheduleType, 
        selectedDates, 
        selectedDays, 
        timeRange 
    } = req.body;

    const newEvent = new Event({
        eventName,
        scheduleType,
        selectedDates,
        selectedDays,
        timeRange
    });

    try {
        await newEvent.save();
        res.status(201).json({ message: 'Event saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save the event' });
    }
});

// Health check endpoint for Render
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
