# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Default Nginx config should be enough, but if needed, custom config here
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
