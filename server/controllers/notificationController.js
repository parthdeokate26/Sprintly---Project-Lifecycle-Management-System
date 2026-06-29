const Task = require("../models/Task");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");



const markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Ensure the notification belongs to the logged-in user
        if (notification.sentTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this notification."
            });
        }

        if (notification.isRead) {
            return res.status(400).json({
                success: false,
                message: "Notification has already been marked as read."
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read successfully."
        });

    } catch (error) {
        console.error("Mark Notification Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const getNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({
            sentTo: req.user.id
        })
        .populate("sentBy", "name email role")
        .populate("task", "title status")
        .populate("project", "title")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications.",
            error: error.message
        });

    }
};

const getNotificationById = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.id)
            .populate("sentBy", "name email role")
            .populate("task", "title status")
            .populate("project", "title");

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        if (notification.sentTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        return res.status(200).json({
            success: true,
            notification
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notification.",
            error: error.message
        });

    }
};

module.exports = {
    markNotificationRead,
    getNotifications,
    getNotificationById
}