const express = require("express");
const router = express.Router();

const { createTask, 
    getAllTasks, 
    getMyTasks, 
    assignTester, 
    assignBackToDeveloper, 
    requestDeploymentApproval, 
    sendToDeployment, 
    markDeploymentComplete, 
    completeProject } = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/", authMiddleware, roleMiddleware("seniordev"), createTask);
router.get("/", authMiddleware, roleMiddleware("seniordev"), getAllTasks); //ass by snr dev for snr dev
router.get("/my-tasks", authMiddleware, getMyTasks); //anyone can see task for ass to them 
router.patch("/:id/assign-tester", authMiddleware, roleMiddleware("developer"), assignTester);
router.patch("/:id/assign-back-to-developer", authMiddleware, roleMiddleware("tester"), assignBackToDeveloper);
router.patch("/:id/request-deployment-approval", authMiddleware, roleMiddleware("tester"), requestDeploymentApproval);
router.patch("/deployment/:notificationId", authMiddleware, roleMiddleware("seniordev"), sendToDeployment);
router.patch("/:id/deployed", authMiddleware, roleMiddleware("deployment"), markDeploymentComplete);
router.patch("/complete-project/:notificationId", authMiddleware, roleMiddleware("seniordev"), completeProject);


module.exports = router;