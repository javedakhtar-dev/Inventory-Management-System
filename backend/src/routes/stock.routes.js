const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { history, adjustStock } = require('../controllers/stock.controller');
const router = express.Router();

router.get('/', authMiddleware, history);
router.post('/adjust', authMiddleware, adjustStock);

module.exports = router;
