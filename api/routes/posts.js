// Enum of predefined categories and statues
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { validCategories, validStatus, DB_NAME } = require('../utils/constants')

const router = express.Router();

router.post('/posts', async (req, res) => {

  try {
    const { title, status, content, category } = req.body;

    // Check if required fields are present
    if (!title || !status || !content || !category) {
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
      author_name: req.body.author_name, // Todo: use from jwt
      created_at: Date.now()
    };


    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.insertOne(payload);
    res.status(201).json({ message: 'Data added successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;

    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection
      .find({})
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    res.status(201).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/posts/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      const result = await collection.find({ _id: new ObjectId(id) }).toArray();
      res.status(201).json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.delete('/posts', async (req, res) => {
  try {
    const postId = req.body.id

    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.deleteOne({ _id: new ObjectId(postId) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.put('/posts', async (req, res) => {
  try {
    const { title, status, content, category } = req.body;

    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    
    // Check if at least one field is provided for update
    if (!title && status === undefined && !content && !category) {
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

    const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: updateObject });

    if (result.matchedCount === 1) {
      res.json({ message: 'Record updated successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/topCategories', async (req, res) => {
    try {
      const client = res.locals.mongoClient;
      const database = client.db(DB_NAME);
      const collection = database.collection('posts');
      const result = await collection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray();
      res.status(201).json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;
