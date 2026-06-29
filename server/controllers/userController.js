const User = require("../models/User");

const getAllUsers = async(req, res) => {
    try{
        const users = await User.find({
            role: {$ne : "admin"}
        }).select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    }catch(error) {
        console.error("Get all users Error : ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getPendingUsers = async (req, res) => {
    try {

        const users = await User.find({
            role: { $ne: "admin" },
            status: "pending"
        }).select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get Pending Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const approveUser = async(req, res) =>{
    try{
    const {id} = req.params;

        const user = await User.findById(id);

        if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (user.role === "admin") {
                return res.status(400).json({
                    success: false,
                    message: "Admin account cannot be approved"
                });
            }

            if (user.status === "active") {
                return res.status(400).json({
                    success: false,
                    message: "User is already active"
                });
            }

        user.status = "active";
        await user.save();

        const approvedUser = await User.findById(id).select("email name status");

        return res.status(200).json({
            success: true,
            message: "User approved successfully",
            user: approvedUser
        });
    }catch(error){
        console.error("Approve user error:", error);

        return res.status(500).json({
            success: false,
            message : "Internal server error"
        });
    }
};

const rejectUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin account cannot be rejected"
            });
        }

        if (user.status === "rejected") {
            return res.status(400).json({
                success: false,
                message: "User is already rejected"
            });
        }

        user.status = "rejected";
        await user.save();

        const rejectedUser = await User.findById(id)
            .select("name email role status");

        return res.status(200).json({
            success: true,
            message: "User rejected successfully",
            user: rejectedUser
        });

    } catch (error) {
        console.error("Reject User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin role cannot be changed"
            });
        }

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        const allowedRoles = [
            "seniordev",
            "developer",
            "tester",
            "deployment"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (user.role === role) {
            return res.status(400).json({
                success: false,
                message: "User already has this role"
            });
        }

        user.role = role;
        await user.save();

        const updatedUser = await User.findById(id)
            .select("name email role status");

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Role Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//here only authentication is required not access control, so only token is verified and matched 
//with the user id it was created
//check only logged in user
const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// PATCH /api/users/profile
// Logged-in user
const updateUserProfile = async (req, res) => {
    try {

        const { name, phone, dateOfBirth } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) {
            user.name = name;
        }

        if (phone) {
            user.phone = phone;
        }

        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//user when found via 
module.exports = {
    getAllUsers,
    getPendingUsers,
    approveUser, 
    rejectUser,
    updateUserRole,
    getUserProfile,
    updateUserProfile
};