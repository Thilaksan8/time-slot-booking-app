// Middleware to restrict endpoint access based on User Role (RBAC)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user profile missing"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Role '${req.user.role}' is not authorized to perform this action`
            });
        }

        next();
    };
};

module.exports = { authorizeRoles };
