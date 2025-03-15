require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Correct CORS Setup (Allow Netlify Frontend)
app.use(cors({
    origin: "https://dainty-eclair-08ae9c.netlify.app", // Allow only Netlify frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Middleware
app.use(express.json());

// ✅ Ensure MONGO_URI is Defined
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in the .env file!");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ Define Emotion Schema
const emotionSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    emotions: [{ emotion: String, confidence: Number }]  // Store top 3 emotions
});

const Emotion = mongoose.model("Emotion", emotionSchema);

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Emotion Tracker API! 🎭");
});

// ✅ Route to Save Emotion Data
app.post("/emotion", async (req, res) => {
    try {
        const { emotions } = req.body;

        if (!Array.isArray(emotions) || emotions.length === 0) {
            return res.status(400).json({ message: "Valid emotions array is required!" });
        }

        const newEmotionEntry = new Emotion({ emotions });
        await newEmotionEntry.save();
        res.status(201).json({ message: "Emotion data saved successfully!" });
    } catch (error) {
        console.error("Error saving emotion:", error);
        res.status(500).json({ message: "Error saving data", error });
    }
});

// ✅ Route to Get Stored Emotion Data
app.get("/emotions", async (req, res) => {
    try {
        const emotions = await Emotion.find().sort({ timestamp: -1 });
        res.json(emotions);
    } catch (error) {
        console.error("Error retrieving emotions:", error);
        res.status(500).json({ message: "Error retrieving data", error });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
