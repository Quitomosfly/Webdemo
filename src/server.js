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

<<<<<<< HEAD
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
=======

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema, 'events');
>>>>>>> 39fcad8959521ae7c30c6691ee9d4171a71faa7f

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

<<<<<<< HEAD
app.get('/main-page.html', async (req, res) => {
    const eventId = req.query.id;
    
    if (!eventId || eventId === "undefined") {
        return res.status(400).send("Invalid event ID.");
=======
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
>>>>>>> 39fcad8959521ae7c30c6691ee9d4171a71faa7f
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
<<<<<<< HEAD
            return res.status(404).send("Event not found.");
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send("Server error.");
    }
});

app.get("/events/:id", async (req, res) => {
    const { id } = req.params;

    // Check if ID is valid (MongoDB ObjectId must be 24 characters)
    if (!id || id.length !== 24) {
        return res.status(400).json({ error: "Invalid event ID" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
=======
            return res.status(404).json({ error: "Event not found" });
        }

        console.log("Returning event data:", event); // Debugging
        res.json(event);
    } catch (err) {
>>>>>>> 39fcad8959521ae7c30c6691ee9d4171a71faa7f
        res.status(500).json({ error: "Server error" });
    }
});

<<<<<<< HEAD
=======

>>>>>>> 39fcad8959521ae7c30c6691ee9d4171a71faa7f
// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('Server is running smoothly!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mongoose.set("debug", true);