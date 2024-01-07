const express = require("express");
const router = express.Router();
const billControllers = require("../controllers/billControllers");
const { isAuthenticated } = require("../middlewares/auth");

// Create a new bill
router.post("/", isAuthenticated, billControllers.createBill);

// Get all bills
router.get("/", isAuthenticated, billControllers.getAllBills);

// Get a specific bill by ID
router.get("/:id", billControllers.getBillById);

// Update a bill by ID
router.put("/:id", billControllers.updateBillById);

// Delete a bill by ID
router.delete("/:id", isAuthenticated, billControllers.deleteBillById);

module.exports = router;
