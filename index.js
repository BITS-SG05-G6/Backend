const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errors");

const transactionRoute = require("./routes/transactionRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const category = require("./models/category");
const billRoute = require("./routes/billRoute");

require("dotenv").config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

//CONNECT DATABASE
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// IMPORT ROUTES
app.use("/api", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/bill", billRoute);
app.use("/api/category", categoryRoute)
app.use("/api/wallet", walletRoute);
app.use(errorHandler);

// ROUTES MIDDLEWARE
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

module.exports = app;
