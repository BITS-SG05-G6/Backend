const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
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

// ROUTES MIDDLEWARE

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/api`);
});


module.exports = app;