# Builder
FROM node:22.16 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Runtime
FROM node:22.16
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY .env .env
RUN npm install --only=production
EXPOSE 5000
CMD ["node", "dist/src/main.js"]