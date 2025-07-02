FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies early to optimize rebuild
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the Vite or Webpack dev server port (often 5173 or 8080)
EXPOSE 5173

# Default command: start the dev server
CMD ["npm", "run", "dev"]
