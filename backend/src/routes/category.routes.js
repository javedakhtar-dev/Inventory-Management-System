const express = require("express");
const {
  createCategory,
  categories,
  categoryId,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, categories);
router.get("/:id", authMiddleware, categoryId);
router.patch("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
