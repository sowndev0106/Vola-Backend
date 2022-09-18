FROM node:16

EXPOSE 3000

WORKDIR /app

RUN npm i npm 

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node", "build/index.js"]