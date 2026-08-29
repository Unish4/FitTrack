import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Please login to access this resource",
      });
    }

    const result = verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
      });
    }

    const user = await User.findById(result.data.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account deactivated. Contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    // Check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' is not authorized. Required: ${roles.join(", ")}`,
      });
    }

    next();
  };
};
