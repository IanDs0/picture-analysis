# Use a imagem base do Node.js
FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]
