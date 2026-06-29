const Task = require("../models/Task");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");


const createTask = async (req, res) => {
    try {

        const {
            title,
            description,
            project,
            assignedTo,
            deadline
        } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        if (existingProject.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this project."
            });
        }

        if (
            existingProject.status === "Completed" ||
            existingProject.status === "Cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "Cannot create task for this project."
            });
        }

        const developer = await User.findById(assignedTo);

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found."
            });
        }

        if (developer.role !== "developer") {
            return res.status(400).json({
                success: false,
                message: "Assigned user must be a Developer."
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedBy: req.user.id,
            assignedTo,
            deadline
        });

        if (existingProject.status !== "Development") {
            existingProject.status = "Development";
            await existingProject.save();
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllTasks = async (req, res) => {
    try {

        const projects = await Project.find({
            assignedTo: req.user.id
        }).select("_id");

        const projectIds = projects.map(project => project._id);

        const tasks = await Task.find({
            project: { $in: projectIds }
        })
            .populate("project")
            .populate("assignedBy", "name email role")
            .populate("assignedTo", "name email role");

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyTasks = async (req, res) => {
    try {

        const tasks = await Task.find({
            assignedTo: req.user.id
        })
            .populate("project")
            .populate("assignedBy", "name email role")
            .populate("assignedTo", "name email role");

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const assignTester = async (req, res) => {
    try {

        const { id } = req.params; //task id
        const { assignedTo } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This task is not assigned to you."
            });
        }

        const tester = await User.findById(assignedTo);

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found."
            });
        }

        if (tester.role !== "tester") {
            return res.status(400).json({
                success: false,
                message: "Assigned user must be a Tester."
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        if (project.status !== "Development" && project.status !== "Debugging") {
            return res.status(400).json({
                success: false,
                message: "Project is not in Development phase."
            });
        }

        task.status = "completed";
        await task.save();

        const newTask = await Task.create({
            title: task.title,
            description: task.description,
            project: task.project,
            assignedBy: req.user.id,
            assignedTo,
            deadline: task.deadline          
        });

        project.status = "Testing";
        await project.save();

        res.status(200).json({
            success: true,
            message: "Task assigned to Tester successfully.",
            task: newTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const assignBackToDeveloper = async (req, res) => {
    try {

        const { id } = req.params;
        const { assignedTo, feedbackNote } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This task is not assigned to you."
            });
        }
        task.status = "completed";
        await task.save();
        const developer = await User.findById(assignedTo);

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found."
            });
        }

        if (developer.role !== "developer") {
            return res.status(400).json({
                success: false,
                message: "Assigned user must be a Developer."
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        if (project.status !== "Testing") {
            return res.status(400).json({
                success: false,
                message: "Project is not in Testing phase."
            });
        }

        const newTask = await Task.create({
            title: task.title,
            description: task.description,
            project: task.project,
            assignedBy: req.user.id,
            assignedTo,
            deadline: task.deadline,
            feedbackNote
        });

        project.status = "Debugging";
        await project.save();

        res.status(201).json({
            success: true,
            message: "Task assigned back to Developer successfully.",
            task: newTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const requestDeploymentApproval = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This task is not assigned to you."
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        if (project.status !== "Testing") {
            return res.status(400).json({
                success: false,
                message: "Project is not in Testing phase."
            });
        }

        const seniorDev = await User.findById(project.assignedTo);

        if (!seniorDev) {
            return res.status(404).json({
                success: false,
                message: "Assigned Senior Developer not found."
            });
        }

        if (seniorDev.role !== "seniordev") {
            return res.status(400).json({
                success: false,
                message: "Project is not assigned to a Senior Developer."
            });
        }

        if (task.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Task is already completed."
            });
        }

        task.status = "completed";
        await task.save();

        project.status = "Awaiting Deployment Approval";
        await project.save();

        await Notification.create({
            sentBy: req.user.id,
            sentTo: project.assignedTo,
            description: "Testing complete, ready for deployment approval.",
            task: task._id,
            project: project._id
        });

        return res.status(200).json({
            success: true,
            message: "Deployment approval requested successfully."
        });

    } catch (error) {
        console.error("Request Deployment Approval Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const sendToDeployment = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { deploymentId } = req.body;

        // Find notification
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Only the intended recipient can respond
        if (notification.sentTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to respond to this notification."
            });
        }

        // Prevent duplicate approval
        if (notification.isRead) {
            return res.status(400).json({
                success: false,
                message: "Notification has already been acknowledged."
            });
        }

        // Find project
        const project = await Project.findById(notification.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Project must be awaiting deployment approval
        if (project.status !== "Awaiting Deployment Approval") {
            return res.status(400).json({
                success: false,
                message: "Project is not awaiting deployment approval."
            });
        }

        // Ensure this Senior Developer owns the project
        if (project.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This project is not assigned to you."
            });
        }

        // Validate deployment engineer
        const deploymentEngineer = await User.findById(deploymentId);

        if (!deploymentEngineer) {
            return res.status(404).json({
                success: false,
                message: "Deployment Engineer not found."
            });
        }

        if (deploymentEngineer.role !== "deployment") {
            return res.status(400).json({
                success: false,
                message: "Task can only be assigned to a Deployment Engineer."
            });
        }



        // Mark notification as read
        notification.isRead = true;
        notification.description = "Is sent for deployment";
        await notification.save();

        // Move project to Deployment
        project.status = "Deployment";
        await project.save();

        // Create deployment task
        const deploymentTask = await Task.create({
            title: `Deploy ${project.title}`,
            description: `Deploy project "${project.title}" to production.`,
            project: project._id,
            assignedBy: req.user.id,
            assignedTo: deploymentEngineer._id,
            deadline: project.deadline,
            status: "going on"
        });

        return res.status(200).json({
            success: true,
            message: "Project moved to deployment successfully.",
            deploymentTask
        });

    } catch (error) {
        console.error("Send To Deployment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};


const markDeploymentComplete = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        // Only the assigned Deployment Engineer can complete it
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This task is not assigned to you."
            });
        }

        // Prevent duplicate completion
        if (task.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Task is already completed."
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Project must be in Deployment phase
        if (project.status !== "Deployment") {
            return res.status(400).json({
                success: false,
                message: "Project is not in Deployment phase."
            });
        }

        // Find the Senior Developer assigned to this project
        const seniorDev = await User.findById(project.assignedTo);

        if (!seniorDev) {
            return res.status(404).json({
                success: false,
                message: "Assigned Senior Developer not found."
            });
        }

        if (seniorDev.role !== "seniordev") {
            return res.status(400).json({
                success: false,
                message: "Project is not assigned to a Senior Developer."
            });
        }

        // Mark deployment task as completed
        task.status = "completed";
        await task.save();

        // Notify Senior Developer
        await Notification.create({
            sentBy: req.user.id,
            sentTo: seniorDev._id,
            description: "Project deployment completed successfully.",
            task: task._id,
            project: project._id
        });

        return res.status(200).json({
            success: true,
            message: "Deployment completed successfully. Senior Developer has been notified."
        });

    } catch (error) {
        console.error("Mark Deployment Complete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const completeProject = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Find notification
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Only the intended Senior Developer can respond
        if (notification.sentTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to respond to this notification."
            });
        }

        // Prevent duplicate completion
        if (notification.isRead) {
            return res.status(400).json({
                success: false,
                message: "Notification has already been acknowledged."
            });
        }

        // Find project
        const project = await Project.findById(notification.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        // Ensure project is still in Deployment
        if (project.status !== "Deployment") {
            return res.status(400).json({
                success: false,
                message: "Project is not in Deployment phase."
            });
        }

        // Ensure this Senior Developer owns the project
        if (project.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "This project is not assigned to you."
            });
        }

        // Find Admin
        const admin = await User.findOne({ role: "admin" });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        // Mark notification as read
        notification.isRead = true;
        await notification.save();

        // Mark project as completed
        project.status = "Completed";
        await project.save();

        // Notify Admin
        await Notification.create({
            sentBy: req.user.id,
            sentTo: admin._id,
            description: `Project "${project.title}" has been completed successfully.`,
            project: project._id
        });

        return res.status(200).json({
            success: true,
            message: "Project marked as completed successfully."
        });

    } catch (error) {
        console.error("Complete Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};





module.exports = {
    createTask,
    getAllTasks,
    getMyTasks,
    assignTester,
    assignBackToDeveloper,
    requestDeploymentApproval,
    sendToDeployment,
    markDeploymentComplete,
    completeProject
};