const express = require("express");
const router = express.Router();

const {
    createProject,
    getAllProjects,
    getProjectById,
    assignProject,
    cancelProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only
router.post( "/", authMiddleware, createProject);
router.get( "/", authMiddleware,  getAllProjects);
router.get( "/:id", authMiddleware, getProjectById);


router.patch( "/:id/assign", authMiddleware, roleMiddleware("admin"), assignProject);
router.patch( "/:id/cancel", authMiddleware, roleMiddleware("admin"), cancelProject);

module.exports = router;