const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// Serve static files (like your HTML)
app.use(express.static(path.join(__dirname,"../public")));

// Route to serve your main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data


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
