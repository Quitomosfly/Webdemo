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

mongoose.connect(process.env.MONGO_URI, { dbName: 'eventsDB' })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error', err));
// Serve static files (like your HTML)
app.use(express.static(path.join(__dirname, "../public")));

// Route to serve your main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Define Event Schema
const eventSchema = new mongoose.Schema({
    eventName: String,
    selectedOption: String,
    scheduleType: String,
    selectedDates: [String],
    selectedDays: [String],
    timeRange: String
});

const Event = mongoose.model('Event', eventSchema, 'events');
app.post("/events", async (req, res) => {
    try {
        const newEvent = new Event(req.body); // Ensure `Event` model is correct
        await newEvent.save();

        res.status(201).json({ _id: newEvent._id }); // Ensure _id is sent back
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
});

// Route to handle form submission
app.post('/events', async (req, res) => {
    const { eventName, selectedOption, scheduleType, selectedDates, selectedDays, timeRange } = req.body;

    // Validation for required fields
    if (!eventName || !scheduleType) {
        return res.status(400).json({ error: 'Event name and schedule type are required.' });
    }

    const newEvent = new Event({
        eventName,
        selectedOption,
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

app.get('/main-page.html', async (req, res) => {
    const eventId = req.query.id;
    
    if (!eventId || eventId === "undefined") {
        return res.status(400).send("Invalid event ID.");
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send("Event not found.");
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send("Server error.");
    }
});
if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({ error: "Invalid event ID" });
}
app.get("/events/:id", async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('Server is running smoothly!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
