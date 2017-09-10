FROM node:latest

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies.
RUN npm install
RUN npm install pm2 -g

EXPOSE 3000
CMD ["pm2", "start", "ecosystem.config.js", "--watch", "--no-daemon"]
