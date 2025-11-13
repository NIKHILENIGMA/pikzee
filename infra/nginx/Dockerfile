# Use official lightweight Nginx image
FROM nginx:1.26.3-alpine3.19

# Update and upgrade packages
RUN apk update && apk upgrade --no-cache

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config file into container
COPY nginx.conf /etc/nginx/nginx.conf
