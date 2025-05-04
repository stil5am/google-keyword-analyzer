const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 루트 확인용
app.get('/', (req, res) => {
  res.send('Google Keyword Analyzer Server is running!');
});

// 핵심 API: 키워드 분석
app.post('/analyze', async (req, res) => {
  try {
    const rawKeyword = req.body.keyword;
    const keyword = rawKeyword.replace(/\s/g, '');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 구글 검색 URL 구성 (블로그 글 수 기준)
    const searchUrl = `https://www.google.com/search?q=site:blog.naver.com+${encodeURIComponent(keyword)}`;

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    const contentCountText = await page.$eval('#result-stats', el => el.textContent || '');
    const match = contentCountText.replace(/[\s,]/g, '').match(/약?(\d+)/);

    let contentCount = 0;
    if (match && match[1]) {
      contentCount = parseInt(match[1], 10);
    }

    await browser.close();

    // 간이 경쟁도 및 포화지수 계산 (예시 기준)
    const competition = Math.min(1, contentCount / 1000000).toFixed(2); // 최대 1.0
    const saturation = Math.min(100, Math.floor(contentCount / 10000)); // 10만건 기준 100%

    res.json({
      keyword,
      contentCount,
      competition,
      saturation,
    });
  } catch (error) {
    console.error('분석 실패:', error);
    res.status(500).json({ error: '키워드 분석 중 오류 발생' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
