FROM node:21

WORKDIR /app
COPY ./package.json ./package.json
RUN npm i

#TODO: COPY only necessary files, build, and add ENTRYPOINT
COPY ./ ./