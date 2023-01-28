const express = require('express')
const router = express.Router()

const {createUser, loginUser} = require('../controllers/userController')
const {createTask, updateTask, deleteTask} = require('../controllers/taskController')



                                      // userAPI's
router.post("/register",  createUser);
router.post("/login", loginUser)


                                      // Task API
router.post("/task",  createTask);
router.put("/task/:taskId",  updateTask);
router.delete("/task/:taskId",  deleteTask);


router.all("/****", function (req, res) {
    res.status(404).send({
        status: false,
        message: "please enter the valid URL"
    })
})
