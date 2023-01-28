const userModel = require("../models/userModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const validation = require('../utils/validation');

function isNum(val){
    return !isNaN(val)
  }


const createUser = async function (req, res) {
    try {
      let data = req.body

    if(!validation.isValidRequestBody(data)) { return res.status(400).send({ status: false, message: "Please enter details in the request " }) }

  let {name,email,password,confirmPassword} = data

                        //name validation

  if(!validation.isValid(name)) {
    return res.status(400).send({ status: false, message: "Please enter a valid name" }) }

  if (!/^[a-z ,.'-]+$/i.test(name)) {
     return res.status(400).send({ status: false, message: "name should alpha characters" })};

                            //email validation
  if(!validation.isValid(email)) {
        return res.status(400).send({ status: false, message: "Please enter a valid email"})}
                            //email unique check ---
 const isUniqueEmail = await userModel.findOne({ email: email });
  if(isUniqueEmail) { return res.status(400).send({status: false, message: "Please enter a unique email"})}
                            //email regex check ---

   if (!(email.trim()).match(/^[a-zA-Z_\.\-0-9]+[@][a-z]{3,6}[.][a-z]{2,4}$/)){return res.status(400).send({status: false,message: 'invalid E-mail'})};
                            //password
   if(!validation.isValid(password)) { return res.status(400).send({ status: false, message: "Please enter a valid password" }) }
   if(password.length > 15 || password.length < 8) { return res.status(400).send({status: false, message: "password should be between 15 and 8 characters" }) }

   if(confirmPassword !== password) { return res.status(400).send({status: false, message:"Password and confirm password didn't match" }) }

   const saltRounds = 10;
   const encryptedPassword = await bcrypt.hash(password, saltRounds) //encrypting password by using bcrypt.

   const userData = {
    name,
    email,
    password: encryptedPassword
   }
   const savedData = await userModel.create(userData);
   return res.status(201).send({status: true,message: "User created successfully", data: savedData,});

}

 catch (err) {
        res.status(500).send({ status: false, message: err.message });
      }

      }


 //-------------------Logging user------------------------

 const loginUser = async function (req, res) {
    try {
        const body = req.body;
      if (!validation.isValidRequestBody(body)) { return res.status(400).send({ status: false, message: "Please enter details in the request Body" }) }
      const userName = body.email;
      const  password = body.password;
      if (!userName) { return res.status(400).send({ status: false, message: "Please enter your email Address" }) }
      if (!password) { return res.status(400).send({ status: false, message: "Please enter your password" }) }


      let user = await userModel.findOne({ email: userName});

      if (!user)
        return res.status(400).send({
          status: false,
          message: "user doesn't exist",
        });
      const encryptedPassword = await bcrypt.compare(password, user.password);
      if(!encryptedPassword) { return res.status(400).send({ status: false, message: "Please enter your password correctly" }); }

      let token = jwt.sign(
        {
          userId: user._id.toString(),

        },
        "manUnited", { expiresIn: '1d' }
      );
      res.setHeader("BearerToken", token);
      res.status(200).send({ status: true, message: 'User login successful', data: { userId: user._id, token: token} });
    }
    catch (err) {
      console.log("This is the error :", err.message)
      res.status(500).send({ message: "Error", error: err.message })
    }
  }
//exporting  as a module to be used in routes
module.exports = {createUser, loginUser}
