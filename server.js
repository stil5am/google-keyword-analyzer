const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Google Keyword Analyzer Server is running!');
});

app.post('/analyze', async (req, res) => {
  try {
    const rawKeyword = req.body.keyword || '';
    const keyword = rawKeyword.replace(/\s/g, '');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const searchUrl = `https://www.google.com/search?q=site:blog.naver.com+${encodeURIComponent(keyword)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    const contentCountText = await page.$eval('#result-stats', el => el.textContent || '');
    const match = contentCountText.replace(/[\s,]/g, '').match(/약?(\d+)/);

    let contentCount = 0;
    if (match && match[1]) {
      contentCount = parseInt(match[1], 10);
    }

    await browser.close();

    const competition = Math.min(1, contentCount / 1000000).toFixed(2);
    const saturation = Math.min(100, Math.floor(contentCount / 10000));

    res.json({
      keyword,
      contentCount,
      competition,
      saturation
    });
  } catch (error) {
    console.error('분석 실패:', error);
    res.status(500).json({ error: '키워드 분석 실패' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
