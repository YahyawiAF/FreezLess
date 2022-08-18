FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/feezless-server
WORKDIR /usr/src/feezless-server

# Install app dependencies
COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "restart" ]
