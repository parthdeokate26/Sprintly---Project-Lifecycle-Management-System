const express = require("express");
const router = express.Router();

const { getAllUsers, 
    getPendingUsers, 
    approveUser, 
    rejectUser, 
    updateUserRole, 
    getUserProfile, 
    updateUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/pending", authMiddleware, roleMiddleware("admin"), getPendingUsers);
router.patch("/:id/approve", authMiddleware, roleMiddleware("admin"), approveUser);
router.patch("/:id/reject", authMiddleware, roleMiddleware("admin"), rejectUser);
router.patch("/:id/update", authMiddleware, roleMiddleware("admin"), updateUserRole);
router.get("/profile", authMiddleware, getUserProfile);
router.patch("/profile", authMiddleware, updateUserProfile);
module.exports = router;