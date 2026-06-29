const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
//{
//     instead of Math.random() we will use crypto.randomInt();
// }

const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
    try{
        const {
            name,
            email,
            password,
            phone,
            dateOfBirth,
            dateOfJoining,
            role,
        } = req.body;
        
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "User already exists!"
            });
        }
        if (role === "admin") {
           return res.status(403).json({ message: "Cannot register as admin" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User(
            {
                name,
                email,
                password: hashedPassword,
                phone,
                dateOfBirth,
                dateOfJoining,
                role,
                status: "pending"
            }
        );

        await user.save();

        res.status(201).json({
            message: "Registration successful. Wait for admin approval!"
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};


const loginUser = async(req, res) => {

    try{
        const {email, password} = req.body;

        if(!email || !password){
                return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({email});
        
        if(!user){  
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        if(user.status == "pending"){
            return res.status(403).json({
                success: false,
                message: "Account not approved yet"
            });

        }
        if (user.status === "rejected") {
            return res.status(403).json({
                success: false,
                message: "Account rejected"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // everything fine till now so we will create now token 

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    }catch(error){
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();  //6 digit otp between
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 min

        //after creating otp save it in dp to compare later

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

         // Email content
        const subject = "Password Reset OTP";

        const text = `Your OTP for password reset is: ${otp}

This OTP will expire in 10 minutes.

If you did not request this password reset, please ignore this email.`;
        
        await sendEmail(user.email, subject, text);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });
    }  catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "Please request a new OTP."
            });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
}