export type NewsMockDataType = {
  publisher: string;
  img: string;
  title: string;
  date: string;
  link: string;
};

export const newsMockData: NewsMockDataType[] = [
  {
    publisher: '중앙일보',
    img: 'https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fstatic%2Fnewsstand%2F2024%2F1125%2Farticle_img%2Fnew_main%2F9152%2F071102_001.jpg%22&type=nf312_208&service=navermain',
    title: '[단독] 반도체 산업 신규 투자 확대...정부 지원책 발표',
    date: '11월 03일 18:55 직접 편집',
    link: 'https://www.joongang.co.kr/article/25288962',
  },
  {
    publisher: '동아일보',
    img: 'https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fstatic%2Fnewsstand%2F2024%2F1125%2Farticle_img%2Fnew_main%2F9131%2F172557_001.jpg%22&type=nf312_208&service=navermain',
    title: '청년 주거대책 발표...월세 지원 확대',
    date: '11월 03일 18:39 직접 편집',
    link: 'https://www.donga.com/news/article/all/20241103/123456',
  },
  {
    publisher: '한국경제',
    img: 'https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fstatic%2Fnewsstand%2F2024%2F1125%2Farticle_img%2Fnew_main%2F9029%2F175118_001.jpg%22&type=nf312_208&service=navermain',
    title: '기준금리 동결 전망...시장 영향은?',
    date: '11월 03일 17:50 직접 편집',
    link: 'https://www.hankyung.com/article/2024110387654',
  },
  {
    publisher: '매일경제',
    img: 'https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fstatic%2Fnewsstand%2F2024%2F1125%2Farticle_img%2Fnew_main%2F9243%2F174551_001.jpg%22&type=nf312_208&service=navermain',
    title: '글로벌 기업들의 韓 투자 러시...배경은?',
    date: '11월 03일 17:30 직접 편집',
    link: 'https://www.mk.co.kr/news/2024/11/123987',
  },
  {
    publisher: '한겨레',
    img: 'https://s.pstatic.net/static/newsstand/2024/1103/article_img/9005/171525_001.jpg',
    title: '환경부, 신재생에너지 정책 전면 개편 추진',
    date: '11월 03일 17:15 직접 편집',
    link: 'https://www.hani.co.kr/arti/20241103-654321',
  },
];
