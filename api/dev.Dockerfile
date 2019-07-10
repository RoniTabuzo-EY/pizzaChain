FROM node:11-alpine

# Needed for web3 to work?
# See: https://github.com/ethereum/web3.js/issues/1416#issuecomment-459343945
RUN apk update && apk upgrade 
RUN apk add --no-cache bash git openssh
RUN apk add --no-cache --virtual native-deps --update python krb5 krb5-libs gcc make g++ krb5-dev \
libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
    npm install --quiet node-gyp -g
 

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./.babelrc ./
RUN npm install

ENV CHOKIDAR_USEPOLLING true
cmd npm start
