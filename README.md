## 🍀 Web16 - JuGa

<div align="center">
 <img src="https://github.com/user-attachments/assets/08fff536-beb0-4292-b861-8ef0158ff601" alt="Juga 이미지" width="400">
</div>

<div align="center">
  <h4>실시간 주식 데이터를 활용한 모의투자 경험을 통해 주식 투자에 대해 배울 수 있는 서비스</h4>
 
 [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb16-JuGa&count_bg=%232175F3&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

</div>

---

### ❓ 이런 생각해보신 적 있나요?
- 주식을 한 번도 해보지 않았어요.
- 처음이라 시작하기가 두려워요.
- 자금이 부족해 다양한 시도를 못 해봤어요.
- 주식의 전반적인 시스템을 공부하고 싶어요.

### 🎯 Juga를 통해 이런 걸 경험하세요!
- 실제 주식 투자 전에 게임으로 먼저 경험해보세요.
- 리스크 없이 투자 감각을 키워보세요.

### [🚀 시작하기](https://juga.kro.kr/)

> 위의 시작하기를 누르면 사이트로 이동됩니다.
> 

### 테스트 계정

- ID: **test**
- Password: **1234**

### 주의사항

- 실제 금전적 거래는 이루어지지 않는 모의투자 서비스입니다.

## ⭐️ 프로젝트 기능 소개 



### 메인 페이지
![main](https://github.com/user-attachments/assets/ce214616-8f2a-4017-b9db-001c818d4cc0)

- 메인 페이지에서 코스피, 코스닥 등 실시간 주가 지수를 확인할 수 있습니다.
- 상승률/하락률 TOP5 종목을 주가지수 별로 확인할 수 있습니다.
- 오늘 실시간 주요 뉴스를 확인할 수 있습니다.

### 주식 상세 페이지
![detail11111](https://github.com/user-attachments/assets/d8bdb9b5-050b-4521-93d2-289391a45ff9)

- 해당 주식에 대한 정보를 차트로 확인할 수 있습니다.
- 일별, 실시간 시세를 확인할 수 있습니다.
- 매수, 매도 요청을 할 수 있습니다.

### 주식 차트 
![chart111](https://github.com/user-attachments/assets/58447d3f-598e-4216-935e-223165a567a5)

- 일, 주, 월, 년 단위로 주식 차트를 확인할 수 있습니다.   
- 이동평균선 정보를 활용해 해당 주식의 추이를 더 자세히 확인할 수 있습니다.   
- 라이브러리를 사용하지 않고 canvas를 활용해 직접 구현했습니다.
- [라이브러리 없이 구현한 이유](https://github.com/boostcampwm-2024/web16-JuGa/wiki/라이브러리-없이-차트를-직접-구현한-이유)

## 🏛️ 소프트웨어 아키텍처
<img width="2336" alt="소프트웨어 아키텍처 3 0" src="https://github.com/user-attachments/assets/3e4d5e3c-3fc5-44a5-8a8e-77bd704e22f2">

- 한국투자증권 웹소켓은 한 계좌 당 41개의 종목에 대한 구독만을 유지할 수 있기 때문에, 최대한 많은 구독을 가능하게 하기 위한 방법으로 [Load Balancing](https://github.com/boostcampwm-2024/web16-JuGa/wiki/%5BBE%5D-Nginx-%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%8B%B1%EC%9D%84-%ED%86%B5%ED%95%B4-%ED%95%9C%EA%B5%AD-%ED%88%AC%EC%9E%90-API-%EC%86%8C%EC%BC%93-%EC%A0%9C%ED%95%9C-%EA%B7%B9%EB%B3%B5)을 선택했습니다.
- 서버의 각 컨테이너는 모두 다른 계좌로 연결되어 총 `41*3`개의 구독을 유지할 수 있습니다.
- 추가로, [redis의 pub/sub을 활용](https://github.com/boostcampwm-2024/web16-JuGa/wiki/redis%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%95%9C%EA%B5%AD%ED%88%AC%EC%9E%90-Open-API-%EC%84%B8%EC%85%98-%EA%B4%80%EB%A6%AC)하여 서로 다른 서버로 요청이 들어오더라도 같은 종목에 대한 구독은 하나의 서버에서만 관리하도록 구현해 구독 자원을 최대한 절약하도록 했습니다.

## 🧑🏻 팀원 소개
| 🖥️ Web FE | ⚙️ Web BE | ⚙️ Web BE | 🖥️ Web FE | ⚙️ Web BE |
| --- | --- | --- | --- | --- |
| <img src="https://github.com/dongree.png" width="400"/> | <img src="https://github.com/uuuo3o.png" width="400"/> | <img src="https://github.com/jinddings.png" width="400"/> | <img src="https://github.com/dannysir.png" width="400"/> | <img src="https://github.com/sieunie.png" width="400"/> |
| [고동우](https://github.com/dongree) | [김진](https://github.com/uuuo3o) | [박진명](https://github.com/jinddings) | [서산](https://github.com/dannysir) | [이시은](https://github.com/sieunie) |
