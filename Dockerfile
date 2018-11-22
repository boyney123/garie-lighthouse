FROM node:8.10.0

RUN mkdir -p /usr/src/garie-lighthouse
WORKDIR /usr/src/garie-lighthouse

COPY package.json .

RUN npm install

# Install Google Chrome
RUN \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb
RUN dpkg -i dumb-init_*.deb

COPY . .

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["npm", "start"]
