const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 루트 경로 확인용
app.get('/', (req, res) => {
  res.send('Google Keyword Analyzer Server is running!');
});

// 키워드 분석 API
app.post('/analyze', (req, res) => {
  const keyword = req.body.keyword;

  // 임시 예시 데이터 (실제 검색량 분석 로직은 추후 추가)
  const result = {
    keyword: keyword,
    searchVolume: Math.floor(Math.random() * 10000), // 가상의 검색량
    competition: Math.random().toFixed(2),           // 가상의 경쟁도
    saturation: Math.random().toFixed(2)             // 가상의 포화지수
  };

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
