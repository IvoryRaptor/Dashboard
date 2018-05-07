FROM nginx

LABEL MAINTAINER="libratone"

COPY dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/

