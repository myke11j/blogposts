// Enum of predefined categories and statues
const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { DB_NAME, SECRET_KEY } = require('../utils/constants')

const router = express.Router();

router.post('/register', async (req, res) => {
  
  try {
    const { username, password } = req.body;
    
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('users');
    
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await collection.insertOne({
      username,
      password: hashedPassword,
    });
    
    res.status(201).json({ message: 'User registered successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error during registeration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('users');
    
    const user = await collection.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '12h' }); // dotenv
    
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
