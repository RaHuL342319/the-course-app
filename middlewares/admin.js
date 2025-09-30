const { JWT_ADMIN_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// Auth middleware
const authAdminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader;
    const verifiedUser = jwt.verify(token, JWT_ADMIN_SECRET);

    req.adminId = verifiedUser.id; // attach decoded payload (id)
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = {
  authAdminMiddleware,
};
