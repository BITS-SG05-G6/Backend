const Bill = require("../models/bill");
const ErrorHandler = require("../utils/ErrorHandler");

// Function to calculate next due date based on frequency
const calculateNextDueDate = (startDate, frequency) => {
  let nextDueDate;
  if (frequency && startDate) {
    const currentDate = new Date(startDate);

    switch (frequency) {
      case "Daily":
        nextDueDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        break;
      case "Weekly":
        nextDueDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
        break;
      case "Monthly":
        nextDueDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 1)
        );
        break;
      case "Quarterly":
        nextDueDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 3)
        );
        break;
      case "Anually":
        nextDueDate = new Date(
          currentDate.setFullYear(currentDate.getFullYear() + 1)
        );
        break;
      default:
        break;
    }
  } else {
    // If frequency is null, set nextDueDate to null
    nextDueDate = null;
  }
  return nextDueDate;
};

// Create a new bill
const createBill = async (req, res, next) => {
  const nextDueDate = req?.body?.startDate
    ? calculateNextDueDate(req?.body?.startDate, req.body?.frequency)
    : null;
  let VNDAmount;
  let USDAmount;
  if (req?.body?.currency === "VND") {
    VNDAmount = req?.body?.amount;
    USDAmount = req?.body?.exchangeAmount;
  } else {
    USDAmount = req?.body?.amount;
    VNDAmount = req?.body?.exchangeAmount;
  }

  const data = {
    title: req?.body?.title,
    VND: VNDAmount,
    USD: USDAmount,
    currency: req?.body?.currency,
    reminder: req?.body?.reminder,
    startDate: req?.body?.startDate ? req?.body?.startDate : new Date(),
    frequency: req.body?.frequency ? req.body?.frequency : null,
    description: req?.body?.description,
    nextDueDate: nextDueDate,
    user: req.userID,
    transactionType: "Bill",
  };
  try {
    // console.log(data);
    const bill = await Bill.create(data).catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });

    res.status(200).json({ message: "Bill created successfully", data: bill });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userID });
    const billInfo = bills.map((bill) => {
      let nextDueDate = null;
      let frequency = null;
      if (bill.reminder) {
        nextDueDate = bill.nextDueDate;
        frequency = bill.frequency;
      }

      const amount = bill.currency === "VND" ? bill.VND : bill.USD;

      return {
        _id: bill._id,
        title: bill.title,
        amount: amount,
        currency: bill.currency,
        startDate: bill.startDate,
        nextDueDate: nextDueDate,
        reminder: bill.reminder,
        status: bill.status,
        frequency: frequency,
      };
    });
    res.status(200).json(billInfo);
    // console.log(bills);
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
const deleteBillById = async (req, res, next) => {
  try {
    // console.log(req.params);
    const deletedBill = await Bill.findByIdAndDelete(req.params.id).catch(
      (err) => {
        next(new ErrorHandler(err.message, 404));
      }
    );
    // if (!deletedBill) {
    //   next(new ErrorHandler("Bill not found", 404));
    //   // return res.status(404).json({ error: "Bill not found" });
    // }
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payBill = async (req, res, next) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        status: "Paid",
        updateAt: new Date(),
      },
      {
        new: true,
      }
    )
      res.status(200).json( "Bill paid successfully");
    
  } catch(err) {
    next(new ErrorHandler(err.message, 404));
  }
  
};

const checkStatus = async(req, res, next) => {
  const bills = await Bill.find()
  .catch((err) => {
    next(new ErrorHandler(err.message, 404))
  })

  bills.map(async(bill) => {
    const today = new Date();
    if (bill.nextDueDate && today.getTime() >= bill.nextDueDate) {
      const nextDue = calculateNextDueDate(bill.nextDueDate, bill.frequency);

      const updatedBill = await Bill.findByIdAndUpdate(
        bill._id,
        {
          startDate: bill.nextDueDate,
          nextDueDate: nextDue,
        },
        {
          new: true,
        }
      )
      const updateTime = updateBill.updateAt.getTime();
      if (updateTime < updatedBill.startDate) {
        await Bill.findByIdAndUpdate(
          bill._id,
          {
            status: "Unpaid",
          },
          {
            new: true,
          }
        )
      }

    }
  })
}

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBillById,
  deleteBillById,
  payBill,
  checkStatus
};
