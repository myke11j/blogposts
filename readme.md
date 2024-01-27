# Blogs

![Top Authors](./resources/image.png)

### Techstack

- Node.js, React
- Mongo

### Steps to run on local

Build and run your Docker image from root dir. Use --build to re-build changes.

```
docker-compose up
docker-compose up --build
```

Enter localhost:4000 in browser to access blog page.

For backend API, please check postman collection in root dir.

#### Dev debugging for docker

```
docker run -it blogs /bin/sh

```

#### To run single service 

To run backend only, go to ./api dir and run or comment out front-end from docker-compose.

```
docker build -t api . 
docker run --name api_c -p 4000:4000 --rm api
```
