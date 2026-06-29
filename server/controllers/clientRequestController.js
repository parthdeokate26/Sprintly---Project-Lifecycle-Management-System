const ClientRequest = require("../models/ClientRequest");

const createClientRequest = async (req, res) => {
    try {
        const { description, email, deadline, invoice } = req.body;

        if (!description || !email || !deadline || invoice == null) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const clientRequest = await ClientRequest.create({
            description,
            email,
            deadline,
            invoice
        });

        res.status(201).json({
            success: true,
            message: "Client request submitted successfully.",
            data: clientRequest
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


const getAllClientRequests = async (req, res) => {
    try {

        const clientRequests = await ClientRequest.find();

        res.status(200).json({
            success: true,
            count: clientRequests.length,
            data: clientRequests
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};


const updateClientRequestStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const status = req.path.includes("approve") ? "approved" : "rejected";

        const clientRequest = await ClientRequest.findById(id); 

        if (!clientRequest) {
            return res.status(404).json({
                success: false,
                message: "Client request not found."
            });
        }

        if (clientRequest.status === status) {
            return res.status(400).json({
                success: false,
                message: `Client request is already ${status}.`
            });
        }

        clientRequest.status = status;

        await clientRequest.save();

        res.status(200).json({
            success: true,
            message: `Client request ${status} successfully.`,
            data: clientRequest
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};

module.exports = {
    createClientRequest,
    getAllClientRequests,
    updateClientRequestStatus
};