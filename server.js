const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve static files from the "pages" directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Default route for the main page (dashboard)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

// Route to serve other pages like notifications, billing, profile, etc.
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

// Set the port (Render will use the environment variable)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
