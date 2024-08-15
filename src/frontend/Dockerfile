# Stage 1: Installing Dependencies

FROM node:22-alpine3.20 AS deps

WORKDIR /app

COPY package*.json .

RUN npm install

# Stage 2: Build App

FROM node:22-alpine3.20 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

RUN rm -rf node_modules

RUN npm install --omit=dev

# Stage 3: Run

FROM node:22-alpine3.20

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD [ "npm", "run", "start" ]

EXPOSE 3000