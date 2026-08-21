const express = require('express');
const { addProduct, getProduct, getProductWithId, updateProduct, deleteProduct } = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, addProduct);
router.get('/', authMiddleware, getProduct);
router.get('/:id', authMiddleware, getProductWithId);
router.patch('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;