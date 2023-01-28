const taskModel=require("../models/taskModel.js")
const userModel=require("../models/userModel.js");
const moment = require("moment");
const validation = require('../utils/validation');


//================create ===============
const createTask = async function (req, res) {
    try{
    let Data = req.body
     //validation of request body --
  if (!validation.isValidRequestBody(Data)) { return res.status(400).send({ status: false, message: "Please enter details"}) }

  let {title, Description, Priority, Status, createdOn} = Data

//title
  if(!validation.isValid(title))  {
    return res.status(400).send({status:false, message: "please use right Title"})
  }
  const titleAlreadyUsed = await taskModel.findOne({title:Data.title})

  if(titleAlreadyUsed != null) { return res.status(400).send({ status:false, message:`${title} is already in use.Enter another title`})}

  //description--
  if(!validation.isValid(Description))  {
    return res.status(400).send({status:false, message: "Needs a Description with capital D"})
  }
//Priority
if(!validation.isValid(Priority))  {
    return res.status(400).send({status:false, message: "please provide a priority"})
  }
  if(!(["Low", "High", "Medium"] ).includes(Priority)){
    return res.send({status: false, message: "Priority should be between  high, low or Medium"})
  }

  //Status
  if(!validation.isValid(Status))  {
    return res.status(400).send({status:false, message: "please provide a Status"})
  }
  if(!(["Pending", "Completed", "Running"] ).includes(Status)){
    return res.send({status: false, message: "Status should be between Pending, completed or Running"})
  }

//createdOn
if(!validation.isValid(createdOn))   {
    return res.status(400).send({status:false, message: "please provide a Status"})
  }

  if(!(moment(createdOn, "MM/DD/YYYY", true).isValid())){
    return res.send({status: false, message: "please enter date in MM/DD/YYYY format"})
  }
const newData = {title, Description, Priority, Status, createdOn}
//creating a new task;
const savedData = await taskModel.create(newData);
  return res.status(201).send({ status: true, message: "Success", data: savedData, });

}catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
  }

  //================edit task ===============
const updateTask = async function(req, res)  {
try{
    let userId = req.params.userId;
    let Data = req.body;
    let {taskId,title, Description, Priority, Status, createdOn} = Data;
    if(!validation.isValid(taskId))  {
        return res.status(400).send({status:false, message: "please provide valid taskId"})
      }
      if (!(validation.isValidObjectId(taskId))){
        return res.status(400).send({status: false, message: "taskId not valid"})
      }

    if (!validation.isValidRequestBody(Data)){
         return res.status(400).send({ status: false, message: "Please enter details"}) }
    let task = await taskModel.findOne({_id: taskId, isDeleted: false})
    if(!task) {
          return res.status(404).send({status: false, message: "Task not found"})
        }


  const taskUpdate = {};
  if(title){

    if(!validation.isValid(title))  {
      return res.status(400).send({status:false, message: "Title invalid"})
    }


    const titleAlreadyUsed = await taskModel.findOne({title: title})
    if(titleAlreadyUsed) {
          return res.status(400).send({ status:false, message:`${title} is already in use.Enter another title`})}

     taskUpdate.title = title
   }

   if(Description){
   if(!validation.isValid(Description))  {
     return res.status(400).send({status:false, message: "needs a valid Description"})
   }
    taskUpdate.Description= Description
 }


 if(Priority){
    if(!validation.isValid(Priority))  {
      return res.status(400).send({status:false, message: "needs a valid Priority"})
    }
    if(!(["Low", "High", "Medium"] ).includes(Priority)){
        return res.send({status: false, message: "Priority should be between  high, low or Medium"})
      }

     taskUpdate.Priority= Priority
  }
  if(Status){
    if(!validation.isValid(Status))  {
      return res.status(400).send({status:false, message: "needs a valid Status"})
    }
    if(!(["Pending", "Completed", "Running"] ).includes(Status)){
        return res.send({status: false, message: "Status should be between Pending, completed or Running"})
      }
     taskUpdate.Status= Status
  }
  if(createdOn){
    if(!validation.isValid(createdOn))   {
        return res.status(400).send({status:false, message: "please provide a Status"})
      }

      if(!(moment(createdOn, "MM/DD/YYYY", true).isValid())){
        return res.send({status: false, message: "please enter date in MM/DD/YYYY format"})
      }
      taskUpdate.createdOn= createdOn
  }
  const update = await taskModel.findOneAndUpdate({_id: taskId}, {$set:taskUpdate}, {new:true})

  return res.status(200).send({status: true, message: "task updated successfully", data: update})
    }catch (error) {
        res.status(500).send({ status: false, message: error.message })
      }
    }

//================ delete task ===============

const deleteTask = async function(req, res) {
    try{
      let taskId = req.params.taskId
      if (!(validation.isValidObjectId(taskId))){
        return res.status(400).send({status: false, message: "taskId not valid"})
      }
      let task = await taskModel.findOne({_id: taskId, isDeleted: false})
      if(!task) {
        return res.status(404).send({status: false, message: "Task not found or already deleted"})
      }

     let deleteTask = await taskModel.findOneAndUpdate({_id: taskId},
      {$set: {isDeleted: true, deletedAt: Date.now()}},
      {new: true})
    return res.status(200).send({status: true, message: "task deleted successfully"})

    }catch (error) {
      res.status(500).send({ status: false, message: error.message })
    }
  }

//exporting  as a module to be used in routes
module.exports = {createTask,updateTask, deleteTask}
