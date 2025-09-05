# Production-ready Dockerfile for Echoes of Ellidra Web Version

# Use nginx alpine for serving static files
FROM nginx:alpine AS production

# Copy built files (assuming dist folder is already built)
COPY dist /usr/share/nginx/html

# Copy nginx configuration for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]