const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Token is missing");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      const error = new Error("Invalid token");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    let statusCode = 500;
    if (error.name === "JsonWebTokenError") statusCode = 401;
    if (error.name === "TokenExpiredError") statusCode = 401;
    error.statusCode = statusCode;
    next(error);
  }
};
