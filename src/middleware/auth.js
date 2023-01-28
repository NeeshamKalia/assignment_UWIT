const userModel = require('../models/userModel');
//const
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const checkAuth = async function (req, res, next) {
    try {
        let userId = req.params.userId;
        if(!userId){ return res.status(400).send({status:false,message:"UserId is required"})}
        let user = await userModel.findOne({_id: userId});
      if(!user){return res.status(404).send({status: false   , message: "User not found."});}
      let token = req.header('Authorization', 'Bearer Token');

      if (!token)
        return res.status(401).send({ status: false, message: "not authorized" });
          bearerToken = token.split(' ')[1]
          jwt.verify(bearerToken,"manUnited", (err, user) => { if (err) return res.status(401).send({message: "Unauthorized access"})});

          let decodedToken = jwt.verify(bearerToken, "manUnited");
          if (decodedToken.length ==0){
            return res.status(404).send({ status: false, message: "token is not valid" })};




          next();

           }
     catch (error) {
      return res.status(500).send({ status: false, Error: error.message });
    }
  };
  const authrz = function (req, res, next) {
    try {
      let userId = req.params.userId;

      bearerToken = (req.header('Authorization', 'Bearer Token')).split(' ')[1]
      let decodedToken = jwt.verify(bearerToken, "manUnited");


      if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "invalid userId" }) }
      if (userId.toString() != decodedToken.userId) {return res.status(403).send({status: false, message: "unauthorized"});}
      next();
    }

 catch (error) {
  return res.status(500).send({ status: false, Error: error.message });
}
};


  module.exports = { checkAuth, authrz };
