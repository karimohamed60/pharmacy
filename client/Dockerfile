# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install
RUN npm install dotenv

# Copy the rest of the application code
COPY . .

# Expose port 5173 to the Docker host
EXPOSE 5173

# Start the React development server
CMD ["npm", "run", "dev"]