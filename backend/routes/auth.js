const express = require('express');
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

const JWT_SECRET = "web_token";

//------------------ROUTE 1--------------------------------
// Create a user using POST: "/api/auth/createuser". No login required
router.post('/createuser',[
     // username must be at least 3 chars long
  body('name','Enter a name of atleast 3 characters').isLength({ min: 3 }),
    // email must be a valid email
  body('email','Enter a valid email').isEmail(),  
  // password must be at least 5 chars long
  body('password','Enter a password of atleast 5 chracters').isLength({ min: 5 }),
],async (req,res)=>{

    let success = false;
    // if there are errors, return them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email exists
    try{
        let user = await User.findOne({email : req.body.email});
        if(user){
            return res.status(400).json({success, error: "Sorry a user with this email already exists"})
        }

        //Creating hash of password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        //Creating a user with the same credentials
        user = await User.create({
            name: req.body.name,
            password: hash,
            email : req.body.email
        })

        //Sending token back to user
        var data = {user:{
          id : user.id}
        }
        var authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken})
    }

    //For any error that occurs during normal processing
    catch(error){
        console.log(error);
        res.status(500).send({error : "Internal server error"});
    }
})

//--------ROUTE 2-------------------
//  Auithenticate a user using POST: "/api/auth/login". No Login required
router.post('/login',[
 // email must be a valid email
body('email','Enter a valid email').isEmail(),  
// password must not be blank
body('password','Password must not be blank').exists()
],async (req,res)=>{

  let success = false;
 // if there are errors, return them
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({success, errors: errors.array() });
 }

 const {email, password} = req.body;
 try {
  //Checking if entered email exists
  let user = await User.findOne({email});
  if(!user){
      return res.status(400).json({success,error: "Try again to login with correct credentials"});
  }

  //Comparing password from database
  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare){
      return res.status(400).json({success, error: "Try again to login with correct credentials"});
  }

  //Sending token back to user
  var data = {user:{
    id : user.id}
  }
  var authToken = jwt.sign(data, JWT_SECRET);
  success =true;
  res.json({authToken, success})

  //For any error that occurs during normal processing
 } catch (error) {
  console.log(error);
  res.status(500).send({error : "Internal server error"});
 }
})

//--------ROUTE 3-------------------
// Get Loggedin user details using POST: "/api/auth/getuser". No login required
router.post('/getuser',fetchuser,async (req,res)=>{
  
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); 
    res.send(user);
  } catch (error) {
    console.log(error);
  res.status(401).send({error : "Internal server error"});
  }

 })

module.exports = router;