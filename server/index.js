const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRequestRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


dotenv.config();
connectDB();
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/client-requests", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port $PORT}`);
});