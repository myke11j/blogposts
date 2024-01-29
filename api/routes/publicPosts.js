// Public routes for posts
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const { validCategories, validStatus, DB_NAME } = require('../utils/constants')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;
    
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    
    const totalCount = await collection.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    const result = await collection
    .find({ status: 1 }) // Show only published posts on activity page
    .sort({ created_at: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
    
    res.status(200).json({
      posts: result,
      currentPage: page,
      totalPages,
      pageSize,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.find({ _id: new ObjectId(id) }).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Note: no pagination, it returns all posts
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.find({ category, status: 1 }).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/top/category', async (req, res) => {
  try {
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.aggregate([
      { $match: { status: 1 } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/top/users', async (req, res) => {
  try {
    const client = res.locals.mongoClient;
    const database = client.db(DB_NAME);
    const collection = database.collection('posts');
    const result = await collection.aggregate([
      { $match: { status: 1 } },
      { $group: { _id: '$author_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

module.exports = router;