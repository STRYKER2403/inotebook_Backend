const express = require('express')
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")
const router = express.Router()

const JWT_SECRET = "SwapIsNice";

//ROUTE 1: Create a User Using POST "/api/auth/createuser". No login required
router.post("/createuser", [
  body('name', "Enter a valid Name").isLength({ min: 3 }),
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password must be 5 characters long").isLength({ min: 5 }),
], async (req, res) => {

  let success = false;
  // If there are errors, return bad requests and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  try {

    // Check whether user with this email exist or not
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, errors: "Sorry user with this email already exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const SecPass = bcrypt.hashSync(req.body.password, salt);

    // create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: SecPass
    });

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authToken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})


//ROUTE 2: Authenticate a User POST "/api/auth/login". No login required
router.post("/login", [
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res) => {

  let success = false;
  // If there are errors, return bad requests and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({success, errors: "Please Enter Valid Credentials" });
    }

    const passComp = bcrypt.compareSync(password, user.password);

    if (!passComp) {
      return res.status(400).json({success, errors: "Please Enter Valid Credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    
    
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authToken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});

// Middleware - function called whenever there is request on login required routes
//ROUTE 3: Get user details POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});

module.exports = router
