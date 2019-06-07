FROM node:lts-alpine

# Install Google Chrome
RUN apk --no-cache --update add chromium

RUN mkdir -p /usr/src/garie-lighthouse
WORKDIR /usr/src/garie-lighthouse

COPY package.json .

RUN npm install --only=production

COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]