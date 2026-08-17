FROM node:20

COPY ./app/package.json ./app/yarn.lock /app/
WORKDIR /app
RUN yarn --frozen-lockfile

COPY ./app/ /app/

#COPY ./build.env /app/.env
RUN yarn build #REQUIRES THE MEDUSA BACKEND RUNNING FOR PAGES
#RUN rm /app/.env
