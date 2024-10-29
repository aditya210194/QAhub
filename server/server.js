const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle contact form submissions
app.post('/submitContactForm', (req, res) => {
    const { name, email, message } = req.body;

    // Here you can handle the data (e.g., save it to a database, send an email, etc.)
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

    // Respond to the client
    return res.json({ success: true });
});

// Optional: Add a root route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
