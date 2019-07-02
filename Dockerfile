FROM node:9-slim

WORKDIR /usr/src/app

ENV PORT 3000

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]