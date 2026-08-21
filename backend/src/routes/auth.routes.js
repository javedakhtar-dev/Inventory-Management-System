const express = require('express');
const { signup, login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/', authMiddleware, profile)

module.exports = router;
