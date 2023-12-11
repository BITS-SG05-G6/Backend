const express = require('express')
const router = express.Router();
const userController = require("../controllers/userController") 

//Add User
router.post("/", userController.createUser)
//View all user
router.get("/", userController.viewAllUser)

//Get a user
router.get("/:id",userController.getAnUser)
module.exports = router;