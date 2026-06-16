FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/TaskManagerApp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5050
CMD ["/bin/sh", "-c", "sed -i 's/listen 80/listen '${PORT:-5050}'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]