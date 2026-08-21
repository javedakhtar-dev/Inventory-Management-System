const express = require('express');
const { createPurchases, purchases, purchaseId } = require('../controllers/purchase.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(), createPurchases)
router.get('/', authMiddleware, roleMiddleware(), purchases)
router.get('/:id', authMiddleware, roleMiddleware(), purchaseId)

module.exports = router;
