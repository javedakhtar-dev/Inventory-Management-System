const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  addCustomer,
  deleteCustomer,
  updateCustomer,
  customerId,
  customers,
} = require("../controllers/customer.controller");
const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(), addCustomer);
router.get("/", authMiddleware, roleMiddleware(), customers);
router.get("/:id", authMiddleware, roleMiddleware(), customerId);
router.patch("/:id", authMiddleware, roleMiddleware(), updateCustomer);
router.delete("/:id", authMiddleware, roleMiddleware(), deleteCustomer);

module.exports = router;
