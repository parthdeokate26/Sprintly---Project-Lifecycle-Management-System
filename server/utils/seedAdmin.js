// seed script is something you run manually

//Adding default roles
// Adding sample projects
// Adding lookup data

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../models/User");

dotenv.config();
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected!");
    }catch(error){
        console.error("Database Connection failed : ", error.message);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    try{
        await connectDB();

        const existingAdmin = await User.findOne({
            email: "admin@gmail.com"
        });

        if(existingAdmin){
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

            const admin = new User({
            name: "System Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            phone: "9999999999",
            dateOfBirth: new Date("2000-01-01"),
            dateOfJoining: new Date(),
            role: "admin",
            status: "active"
        });

        await admin.save();

        console.log("Admin created Successfully");
    } catch (error){
        console.error("Error:", error.message);
    }finally {
        // Disconnect from MongoDB
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

seedAdmin();