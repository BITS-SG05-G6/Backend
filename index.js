const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errors");
var cron = require('node-cron');

const transactionRoute = require("./routes/transactionRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const billRoute = require("./routes/billRoute");
const walletRoute = require("./routes/walletRoute");
const statisticRoute = require("./routes/statisticRoute")
const statisticDetailRoute = require("./routes/statisticDetailRoute")
const savingRoute = require('./routes/savingRoute');
const { checkStatus } = require("./controllers/billControllers");

require("dotenv").config();
const app = express();
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
app.use("/api/category", categoryRoute);
app.use("/api/statistic", statisticRoute);
app.use("/api/statisticdetail", statisticDetailRoute);

app.use("/api/bill", billRoute);
app.use("/api/category", categoryRoute)
app.use("/api/wallet", walletRoute);
app.use("/api/saving", savingRoute);
app.use(errorHandler);

cron.schedule('* * * * * *', checkStatus);

// ROUTES MIDDLEWARE
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

module.exports = app;
