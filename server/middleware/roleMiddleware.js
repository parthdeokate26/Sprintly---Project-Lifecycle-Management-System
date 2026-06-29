// Is this authenticated user allowed to perform this action
// It assumes authMiddleware has already run.
// Single Responsibility Principle (SRP)

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access forbidden. You do not have permission."
            });
        }
        next();
    };
};

module.exports = roleMiddleware;
