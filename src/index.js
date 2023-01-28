
const express = require("express");

const route = require("./route/route.js");
const mongoose  = require("mongoose");
const app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))


mongoose
  .connect(
    "mongodb+srv://neeshKal:sa6NCNYD20oIkydm@cluster0.oyrlcrd.mongodb.net/tasking",
    {
      useNewUrlParser: true}
  )
  .then(() => console.log("Connected with MongoDB"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
