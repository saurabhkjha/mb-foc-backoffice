FROM node:14.17.0 as build
WORKDIR /mb-foc-Backoffice

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
FROM nginx:1.22

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /mb-foc-Backoffice/build /usr/share/nginx/html

