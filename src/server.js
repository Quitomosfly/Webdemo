require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// Serve static files (like your HTML)
app.use(express.static(path.join(__dirname, "../public")));

// Route to serve your main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

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
app.post('/events', async (req, res) => {
    const { eventName, scheduleType, selectedDates, selectedDays, timeRange } = req.body;

    // Validation for required fields
    if (!eventName || !scheduleType) {
        return res.status(400).json({ error: 'Event name and schedule type are required.' });
    }

    const newEvent = new Event({
        eventName,
        scheduleType,
        selectedDates: selectedDates || [],
        selectedDays: selectedDays || [],
        timeRange
    });

    try {
        await newEvent.save();
        res.status(201).json({ message: 'Event saved successfully!' });
    } catch (error) {
        console.error('Database save error:', error.message);
        res.status(500).json({ error: 'Failed to save the event.' });
    }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('Server is running smoothly!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
