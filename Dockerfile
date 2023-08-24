FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

COPY App/index.js ./

CMD [ "nodemon", "index.js" ]