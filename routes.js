import { get } from 'axios';
import app, { get as _get } from './app';

_get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];

  const fetchData = async (url) => {
    try {
      const response = await get(url, { timeout: 500 });
      return response.data.numbers || [];
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return [];
    }
  };

  const results = await Promise.all(urlList.map(fetchData));
  const mergedNumbers = results.flat().filter((num, index, arr) => arr.indexOf(num) === index).sort((a, b) => a - b);

  return res.json({ numbers: mergedNumbers });
});

export default app;
