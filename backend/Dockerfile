# 1. Build Stage
FROM node:22.16 AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# install dependencies
RUN npm install

# Copy Code
COPY . .

# build nestjs app
RUN npm run build

# 2. Runtime Stage
FROM node:22.16

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY .env .env

EXPOSE 5000

# Start app
CMD ["node", "dist/src/main.js"]