const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


const { markNotificationRead, 
        getNotifications, 
        getNotificationById} = require("../controllers/notificationController");


router.patch("/:notificationId/read", authMiddleware, markNotificationRead);
router.get("/", authMiddleware, getNotifications);
router.get("/:id", authMiddleware, getNotificationById);



module.exports = router;