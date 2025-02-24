require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const scrapeData = require('./scraper'); // Make sure scraper.js is in the same folder

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send("Backend is running on Render!"));

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: "Please provide a URL to scrape." });
  }
  try {
    const data = await scrapeData(url);
    if (!data) {
      return res.status(500).json({ success: false, error: "Scraping returned no data." });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape the website.",
      details: error.message,
    });
  }
});

// Ensure PORT is defined and bind to all interfaces
const PORT = process.env.PORT;
if (!PORT) {
  console.error("PORT environment variable is not set. Exiting.");
  process.exit(1);
}
app.listen(PORT, '0.0.0.0', () => console.log(`Express server running on port ${PORT}`));
