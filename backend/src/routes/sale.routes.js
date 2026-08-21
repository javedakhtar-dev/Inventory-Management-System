const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { createSale, saleId, sales } = require('../controllers/sale.controller');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(), createSale);
router.get('/', authMiddleware, roleMiddleware(), sales);
router.get('/:id', authMiddleware, roleMiddleware(), saleId);

module.exports = router;
