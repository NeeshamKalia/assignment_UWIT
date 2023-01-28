const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
 Description:{
    type: String,
      required: true,
      trim: true,
 },
Priority: {
      type: String,
      required: true,
      enum: ['High', 'Low','Medium']

    },
Status: {
        type: String,
        required: true,
        enum: ['Pending', 'Running', 'Completed']

      },
createdOn: {
        type: Date,
        required: true,
        trim: true,

      }
    },
    {timestamps: true }

);
module.exports = mongoose.model("Tasks", taskSchema);
