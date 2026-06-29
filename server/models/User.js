const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        
        password: {
            type: String,
            required: true,
            minlength: 6
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
        },

        dateOfJoining: {
            type: Date, 
            default: Date.now
        },

        role: {
            type: String,
            enum: ["admin", "seniordev", "developer", "tester", "deployment"],
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "active", "rejected"],
            default: "pending"
        },
        otp: {
    type: String,
    default: null,
},

otpExpiry: {
    type: Date,
    default: null,
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);