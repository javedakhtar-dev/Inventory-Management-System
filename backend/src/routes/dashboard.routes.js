const express = require('express');
const dashboard = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, dashboard);

module.exports = router;
