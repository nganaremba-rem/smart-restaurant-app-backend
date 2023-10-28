FROM node:18

# working dir
WORKDIR /app

# Copy package.json
COPY ./package*.json ./

#COPY files
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node","index.js"]

