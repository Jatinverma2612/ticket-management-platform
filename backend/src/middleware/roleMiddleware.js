/**
 * Role-based authorization middleware
 * @param  {...string|string[]} roles - One or more allowed roles
 */
const requireRole = (...roles) => {
  const flatRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
    }

    if (!flatRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions.',
      });
    }

    next();
  };
};

module.exports = { requireRole };
