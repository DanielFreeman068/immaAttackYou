require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to MongoDB
console.log('MongoDB URI:', process.env.MONGODB_URI);
connectDB(); // Connect to MongoDB

// Middleware to parse JSON requests
app.use(express.json()); 
app.use(express.static('public'));



// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/pages/input.html')); // Serve the HTML file
});


// Export the app
module.exports = app;