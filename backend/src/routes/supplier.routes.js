const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { addSupplier, suppliers, supplierId, updateSupplier, deleteSuppier } = require('../controllers/supplier.controller');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(), addSupplier);
router.get('/', authMiddleware, roleMiddleware(), suppliers);
router.get('/:id', authMiddleware, roleMiddleware(), supplierId);
router.patch('/:id', authMiddleware, roleMiddleware(), updateSupplier);
router.delete('/:id', authMiddleware, roleMiddleware(), deleteSuppier);

module.exports = router;
