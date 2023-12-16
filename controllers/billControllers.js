const { Bill } = require("../models/bill");

// Function to calculate next due date based on frequency
const calculateNextDueDate = (bill) => {
  if (bill.frequency && bill.dueDate) {
    const currentDate = new Date(bill.dueDate);
    switch (bill.frequency) {
      case "Every Day":
        bill.nextDueDate = currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "Every Week":
        bill.nextDueDate = currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "Every Month":
        bill.nextDueDate = currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "Every Year":
        bill.nextDueDate = currentDate.setFullYear(
          currentDate.getFullYear() + 1
        );
        break;
      default:
        break;
    }
  } else {
    // If frequency is null, set nextDueDate to null
    bill.nextDueDate = null;
  }
};

// Create a new bill
const createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body);

    // Calculate the nextDueDate before saving
    calculateNextDueDate(newBill);

    const savedBill = await newBill.save();
    res
      .status(201)
      .json({ message: "Bill created successfully", data: savedBill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res
      .status(200)
      .json({ message: "Bills fetched successfully", data: bills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific bill by ID
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    res.status(200).json({ message: "Bill fetched successfully", data: bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a bill by ID
const updateBillById = async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    // Calculate the nextDueDate before sending the response
    calculateNextDueDate(updatedBill);

    res
      .status(200)
      .json({ message: "Bill updated successfully", data: updatedBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a bill by ID
const deleteBillById = async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    res.status(204).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBillById,
  deleteBillById,
};
