# 빌드 스테이지
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ARG 정의
ARG VITE_SOCKET_URL
ARG VITE_API_URL
ARG VITE_API_KAKAO_URL
ARG VITE_STORAGE_KEY
ARG VITE_MAX_HISTORY_ITEMS

# 환경변수 설정
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_KAKAO_URL=${VITE_API_KAKAO_URL}
ENV VITE_STORAGE_KEY=${VITE_STORAGE_KEY}
ENV VITE_MAX_HISTORY_ITEMS=${VITE_MAX_HISTORY_ITEMS}

RUN npm run build

# 실행 스테이지
FROM nginx:alpine
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
#time zone 설정
RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]