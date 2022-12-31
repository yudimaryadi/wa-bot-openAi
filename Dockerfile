FROM node:latest

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get update \
    && apt install --assume-yes chromium \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 

WORKDIR /usr/app
COPY package.json ./

ENV TZ="Asia/Jakarta"

RUN npm install

COPY . .

RUN ls -la

EXPOSE 80 3000
CMD [ "node", "index.js" ]