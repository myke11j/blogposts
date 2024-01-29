// Auth routes for posts
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const { validCategories, validStatus, DB_NAME, SECRET_KEY } = require('../utils/constants')
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const author_name = user.username
      const { title, published, content, category } = req.body;
      const status = published ? 1 : 0
      // Check if required fields are present
      if (!title || !content || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Check if status is either 0 or 1
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: 'Status should be 0 or 1' });
      }
      
      // Check if category is a valid enum value
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      
      const payload = {
        title,
        status,
        content,
        category,
        author_name,
        created_at: Date.now()
      };
      
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      const result = await collection.insertOne(payload);
      res.status(200).json({ message: 'Data added successfully', insertedId: result.insertedId });
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.delete('/', async (req, res) => {
  try {
    const { token, id } = req.body;
    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      
      const result = await collection.deleteOne({
        $and: [
          { _id: new ObjectId(id) },
          { author_name: user.username }
        ]
      });
      if (result.deletedCount === 1) {
        res.json({ message: 'Record deleted successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.put('/', async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, SECRET_KEY, async (err, _) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      const { id, title, published, content, category } = req.body;
      const status = published ? 1 : 0
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      
      // Check if at least one field is provided for update
      if (!title && !content && !category && !id) {
        return res.status(400).json({ message: 'At least one field is required for update' });
      }
      
      // Check if status is either 0 or 1
      if (status !== undefined && !validStatus.includes(status)) {
        return res.status(400).json({ message: 'Status should be 0 or 1' });
      }
      
      // Check if category is a valid enum value
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      
      const updateObject = {};
      if (title !== undefined) updateObject.title = title;
      if (status !== undefined) updateObject.status = status;
      if (content !== undefined) updateObject.content = content;
      if (category !== undefined) updateObject.category = category;
      
      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateObject });
      
      if (result.matchedCount === 1) {
        res.json({ message: 'Record updated successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.post('/all', async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const page = parseInt(req.query.page) || 1;
      const pageSize = 20;
      
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      
      const totalCount = await collection.countDocuments();
      const totalPages = Math.ceil(totalCount / pageSize);
      const result = await collection
      .find({ author_name: user.username })
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
      
      return res.status(200).json({
        posts: result,
        currentPage: page,
        totalPages,
        pageSize,
        totalCount,
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

module.exports = router;
