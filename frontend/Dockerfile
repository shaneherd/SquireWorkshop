# Use the official Node.js image as the base image
FROM node:20.3.1 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies (and for now force, since we have peer dependency conflicts)
RUN npm ci --force

# Copy the rest of the application code to the working directory
COPY . .

# Make build work on node 18+
# https://stackoverflow.com/a/69699772
ENV NODE_OPTIONS=--openssl-legacy-provider

# generate prod config
RUN echo "export const environment = { environmentName: 'prod', production: true, backendUrl: '/api' };" > ./src/environments/environment.prod.ts

# Build the Angular app
RUN npm run build:prod

# Use spa-to-http to serve the Angular app without any need for configuration
FROM devforth/spa-to-http:1.0.6

# Copy the built Angular app from the previous stage to the server
COPY --from=builder /app/dist .

# Enable brotli and gzip compression for clients that support it
CMD ["/bin/go-http-server", "--brotli", "--gzip"]