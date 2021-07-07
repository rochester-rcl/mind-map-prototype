FROM node:16

WORKDIR /home/node/working

COPY package*.json /home/node/working/

RUN npm install

ENTRYPOINT [ "npm", "start" ]