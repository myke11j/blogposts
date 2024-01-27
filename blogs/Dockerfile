FROM node:21-bullseye

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Copy contents of ./public/ into /app/public/
COPY ./public /app/public

RUN npm run build

EXPOSE 3000
# required for docker desktop port mapping

CMD ["npm", "start"]