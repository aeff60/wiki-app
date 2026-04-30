FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM base AS development
RUN npm i
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
EXPOSE 4000
CMD ["node", "src/server.js"]
