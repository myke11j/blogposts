const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
const { port, uri, SECRET_KEY } = require('./utils/constants.js')

const app = express();
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client's URL
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Set the MongoDB client in Express locals
app.use((req, res, next) => {
  res.locals.mongoClient = client;
  next();
});

app.use(express.json());

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

const posts = require('./routes/posts');
app.use('/api', authenticateJWT, posts);
const auth = require('./routes/auth');
app.use('/api/auth', auth);