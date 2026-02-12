FROM node:18-alpine AS build
WORKDIR /app

ARG VITE_AUTH_API_BASE
ENV VITE_AUTH_API_BASE=${VITE_AUTH_API_BASE}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
