const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS, JS, Images) from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve static HTML files from the "pages" directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Route for the home page (dashboard)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

// Handle requests for specific pages, e.g., notifications.html
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'pages', page));
});

// Set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
