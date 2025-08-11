# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create uploads directory for temporary files
RUN mkdir -p /tmp/uploads

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY backend/ ./backend/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S easymed -u 1001

# Change ownership of the app directory
RUN chown -R easymed:nodejs /app
RUN chown -R easymed:nodejs /tmp/uploads

# Switch to non-root user
USER easymed

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]