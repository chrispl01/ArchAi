# 1. Build stage
FROM node:22.16 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:22.16
WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "start"]

