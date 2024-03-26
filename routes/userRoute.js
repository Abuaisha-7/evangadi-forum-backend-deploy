const express = require('express');
const router = express.Router();

// authentication middleware
const authMiddleWare = require('../middleWare/authmiddleWare')

// user controller
const {register,login,check} = require("../controller/userController")

// register router
router.post("/register",register)

// login router
router.post("/login",login)

// check user router
router.get("/check",authMiddleWare,check)


module.exports = router ;