const express = require('express')
const router = express.Router()

const {createUser, loginUser} = require('../controllers/userController')
const {createTask, updateTask, deleteTask} = require('../controllers/taskController')
const {checkAuth, authrz} = require('../middleware/auth')



                                      // userAPI's
router.post("/register",  createUser);
router.post("/login", loginUser)


                                      // Task API
router.post("/:userId/task", checkAuth, createTask);
router.put("/task/:userId",checkAuth, authrz,  updateTask);
router.delete("/task/:userId",checkAuth, authrz,  deleteTask);


router.all("/****", function (req, res) {
    res.status(404).send({
        status: false,
        message: "please enter the valid URL"
    })
})

module.exports = router
