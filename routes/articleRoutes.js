const express = require('express');
const router = express.Router();
const { getAllArticles, createArticle } = require('../controllers/articleController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllArticles);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createArticle);

module.exports = router;
