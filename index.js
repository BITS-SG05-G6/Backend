const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const handleErrorMiddleware = require('./middlewares/error');
const walletRoute = require('./routes/walletRoute')
const userRoute = require ('./routes/userRouter')
require('dotenv').config();


// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}));


//CONNECT DATABASE
mongoose.connect(process.env.DATABASE)
.then(() => console.log('DB connected'))
.catch((err) => console.log(err));

// IMPORT ROUTES
// app.use("/api/transaction", transactionRoute);
app.use("/api/wallet", walletRoute)
app.use("/api/user", userRoute)

// ROUTES MIDDLEWARE
app.use(handleErrorMiddleware);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});


module.exports = app;