const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const { port, uri } = require('./utils/constants.js')

const app = express();
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Accept-Encoding');
  next();
});

app.use(express.json());

client.connect().then(() => {
  app.listen(port, () => {
    console.log('Connected to MongoDB');
    console.log(`Server is running on http://localhost:${port}`);
  });
});

// Close the MongoDB connection when the server is terminated
process.on('SIGINT', () => {
  client.close().then(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Set the MongoDB client in Express locals
app.use((req, res, next) => {
  res.locals.mongoClient = client;
  next();
});

const auth = require('./routes/auth');
app.use('/api', auth);

const publicPosts = require('./routes/publicPosts.js');
app.use('/api/public/posts', publicPosts);

const userPosts = require('./routes/userPosts.js');
app.use('/api/auth/posts', userPosts);
