const express = require("express");
const router = express.Router();

const {
    createClientRequest,
    getAllClientRequests,
    updateClientRequestStatus
} = require("../controllers/clientRequestController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", createClientRequest);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllClientRequests);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllClientRequests);
router.patch("/:id/approve", authMiddleware, roleMiddleware("admin"), updateClientRequestStatus);
router.patch("/:id/reject", authMiddleware, roleMiddleware("admin"), updateClientRequestStatus);
module.exports = router;