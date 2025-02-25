require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Basic middleware and routes
app.use(express.json());

app.get('/', (_, res) => {
  res.send("Backend is running on Render!");
});

// New endpoint for scraping webpage titles
app.get('/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').text();

    res.json({ url, title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the webpage' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
