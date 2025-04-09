require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup
const allowedOrigins = [
    'https://happybirthdayananya.site',
    'https://dainty-eclair-08ae9c.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.options('*', cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Emotion Schema
const emotionSchema = new mongoose.Schema({
    emotions: [
        {
            emotion: String,
            confidence: Number
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    }
});
const Emotion = mongoose.model('Emotion', emotionSchema);

// POST /emotion API
app.post('/emotion', async (req, res) => {
    const { emotions } = req.body;

    if (!emotions || !Array.isArray(emotions)) {
        return res.status(400).json({ error: 'Invalid emotion data format' });
    }

    try {
        const newEmotion = new Emotion({ emotions });
        const savedEmotion = await newEmotion.save();
        console.log('🎭 Emotion data saved:', savedEmotion);
        res.status(200).json({ message: 'Emotion data received successfully' });
    } catch (err) {
        console.error('❌ Error saving emotion data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Minimal Home Route for Render to detect the server
app.get('/', (req, res) => {
    res.send('Emotion Tracker Backend is live.');
});

// Start Server (IMPORTANT: Must use process.env.PORT for Render)
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
