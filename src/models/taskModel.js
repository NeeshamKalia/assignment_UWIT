const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: 'string',
      required: true,
      trim: true
    },
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

      },
    isDeleted:{
      type: Boolean,
      default: false
    }
    },
    {timestamps: true }

);
module.exports = mongoose.model("Tasks", taskSchema);
