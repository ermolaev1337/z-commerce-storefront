FROM node

COPY ./app/package.json /app/package.json
WORKDIR /app
RUN yarn

COPY ./app/ /app/

#COPY ./build.env /app/.env
#RUN yarn build # REQUIRES THE MEDUSA BACKEND RUNNING FOR PAGES
#RUN rm /app/.env
