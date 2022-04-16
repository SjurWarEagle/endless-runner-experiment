#########
# STAGE #
#########
FROM node:16.13.1 as buildstage

RUN apt update -y && \
    apt install -y --no-install-recommends --no-install-suggests \
    nginx \
    ca-certificates &&\
    rm -rf /var/cache/apt/ &&\
    rm -rf /var/lib/apt/lists/*
RUN mkdir -p /project
RUN mkdir -p /project/public/
RUN mkdir -p /project/src/

COPY ./public /project/public
COPY ./src /project/src
COPY ./package.json /project
COPY ./LICENSE /project

WORKDIR /project

RUN npm install -g parcel-bundler

RUN npm install
RUN ls -al /project/
RUN npm run build

#########
# STAGE #
#########
FROM nginx:stable-alpine
RUN mkdir -p /project
COPY --from=buildstage /project/dist /usr/share/nginx/html
RUN ls -al /etc
RUN ls -al /usr/share/nginx/html
