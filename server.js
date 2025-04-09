require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. Full CORS Setup with dynamic origin check
const allowedOrigins = [
    'https://happybirthdayananya.site',
    'https://dainty-eclair-08ae9c.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl/Postman)
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
