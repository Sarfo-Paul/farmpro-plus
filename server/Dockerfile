FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dev.db ./dev.db
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
EXPOSE 4000
CMD ["node", "dist/server.js"]
