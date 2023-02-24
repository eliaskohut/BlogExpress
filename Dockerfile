FROM node:latest
WORKDIR /nodejsblog
COPY . /nodejsblog
COPY package*.json ./
RUN npm install
RUN npm install ejs
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
