FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Run tests
RUN npm run test

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# run docker build -t my-web-app .
# to run the app in your local env run this-
# docker run -p 3000:3000 my-web-app   
