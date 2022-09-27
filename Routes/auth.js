const express = require('express')
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const router = express.Router()

// Create a User Using POST "/api/auth/createuser". No login required
router.post("/createuser",[
body('name',"Enter a valid Name").isLength({ min: 3 }),
body('email',"Enter a valid email").isEmail(),
body('password',"Password must be 5 characters long").isLength({ min: 5 }),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {   
    
    // Check whether user with this email exist or not
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({ errors: "Sorry user with this email already exist" });
    }

    // create a new user
    user  = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
           
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error: "Please Enter a Unique value for email", message: err.message})}); 
    res.json({user})

    } catch(error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

module.exports = router
