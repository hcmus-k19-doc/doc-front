FROM nginx:1.25-alpine3.17

COPY build /usr/share/nginx/doc-front/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/default.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
