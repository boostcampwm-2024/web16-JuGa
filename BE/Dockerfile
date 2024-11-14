# 빌드 스테이지
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:20-slim
WORKDIR /var/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]