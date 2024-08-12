# # In server/Dockerfile
# FROM node:18-alpine

# WORKDIR /app

# COPY package.json ./
# COPY package-lock.json ./

# RUN npm install

# COPY . .

# EXPOSE 5000

# CMD ["npm", "start"]


# Server Dockerfile
FROM node:14

WORKDIR /index

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
