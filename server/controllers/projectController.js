const Project = require("../models/Project");
const User = require("../models/User")
const ClientRequest = require("../models/ClientRequest");

const createProject = async (req, res) => {
    try{
        const {title, description, clientReference} = req.body;
        if (!title || !description || !clientReference) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const clientRequest = await ClientRequest.findById(clientReference);

        if (!clientRequest) {
            return res.status(404).json({
                success: false,
                message: "Client request not found."
            });
        }

        if(clientReference.status === "rejected"){
            return res.status(400).json({
                success: false,
                message: "only approved client requests can become project"
            });
        }
        const project = await Project.create({
            title,
            description,
            clientReference,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project
        });
    }catch(error) {
        console.log("Create Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getAllProjects = async (req, res) => {

    try {

        const projects = await Project.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {

        console.log("Get Projects Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

};

const getProjectById = async (req, res) => {

    try {

        const { id } = req.params;
//we use populate because they are stoerd ass object id , a reference to user
// , so populate // goes to that location and fetch name email role for that ids
        const project = await Project.findById(id)
            .populate("createdBy", "name email role")
            .populate("assignedTo", "name email role");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        console.log("Get Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

};

const assignProject = async (req, res) => {
    try{
        const {id} = req.params;
        const {assignedTo} = req.body;

        if (!assignedTo) {
            return res.status(400).json({
                success: false,
                message: "Senior Developer ID is required."
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }
        if (project.status === "Cancelled") {
        return res.status(400).json({
        success: false,
        message: "Cancelled projects cannot be assigned."
    });
}
        const seniorDev = await User.findById(assignedTo);
        if (!seniorDev) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if(seniorDev.role !== 'seniordev'){
            return res.status(400).json({
                success: false,
                message: "Assigned user must be Senior Developer"
            });
        }

        project.assignedTo = assignedTo;
        project.status = "Planning";

        await project.save();
        
        res.status(200).json({
            success: true,
            message: "Project assigned successfully.",
            project
        });
    }catch (error) {

        console.log("Assign Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

const cancelProject = async (req, res) => {

    try {

        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }
        if (project.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Project Already Cancelled."
            });
        }

        project.status = "Cancelled";
        if(project.assignedTo){
            project.assignedTo = null;
        }
        await project.save();

        res.status(200).json({
            success: true,
            message: "Project cancelled successfully.",
            project
        });

    } catch (error) {

        console.log("Cancel Project Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

};



module.exports = {
    createProject,
    getProjectById,
    getAllProjects, 
    assignProject,
    cancelProject,

};