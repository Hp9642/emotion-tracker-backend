require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express App
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. CORS Setup with dynamic origin check
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

// ✅ 2. Handle preflight requests
app.options('*', cors());

// ✅ 3. Body Parser
app.use(express.json());

// ✅ 4. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ 5. Emotion Schema & Model
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

// ✅ 6. POST /emotion - Save data
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

// ✅ 7. GET /emotions - Get all saved data
app.get('/emotions', async (req, res) => {
    try {
        const allEmotions = await Emotion.find().sort({ timestamp: -1 });
        res.status(200).json(allEmotions);
    } catch (err) {
        console.error('❌ Error retrieving emotions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ 8. Home route
app.get('/', (req, res) => {
    res.send('🎉 Emotion Tracker Backend is live!');
});

// ✅ 9. Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
