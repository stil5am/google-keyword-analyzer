const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 예시 API 엔드포인트
app.get('/api/keyword-analysis', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: '키워드가 필요합니다.' });
  }

  // 임시로 제공하는 예시 데이터 (실제 분석 로직 추가 필요)
  const data = {
    keyword,
    monthlySearchVolume: 1234,   // 월간 검색량 예시 데이터
    competitionIndex: 67,        // 경쟁도 예시 데이터
    saturationIndex: 45,         // 콘텐츠 포화지수 예시 데이터
    relatedKeywords: ['추천키워드1', '추천키워드2', '추천키워드3']
  };

  res.json(data);
});

// 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
