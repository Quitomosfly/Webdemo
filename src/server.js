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
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
    eventName: String,
    selectedOption: String,
    scheduleType: String,
    selectedDates: [String],
    selectedDays: [String],
    timeRange: String
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema, 'events');

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

const ScheduleSchema = new mongoose.Schema({
    eventName: String,
    selectedDays: [String],  // Example: ["Mon", "Tue", "Wed"]
    timeRange: String        // Example: "04:00 - 11:00"
});

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);


app.get("/schedule", async (req, res) => {
    try {
        const schedule = await Schedule.findOne(); // Fetch first schedule entry
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/events/:eventId', async (req, res) => {
    const { eventId } = req.params;

    console.log("Received eventId:", eventId); // Debugging

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: "Invalid event ID format" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        console.log("Returning event data:", event); // Debugging
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
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

mongoose.set("debug", true);