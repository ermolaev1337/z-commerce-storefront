FROM node:21

WORKDIR /app
COPY ./package.json ./package.json
RUN yarn

#TODO: COPY only necessary files, build, and add ENTRYPOINT
COPY ./ ./