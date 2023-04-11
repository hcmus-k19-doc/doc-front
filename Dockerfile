FROM node:16.19.0-buster as builder

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


FROM nginx:alpine as production

COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/default.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]