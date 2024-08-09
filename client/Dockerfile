FROM node:18-alpine

WORKDIR /next-project

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
