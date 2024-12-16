/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

// Middleware to check if the user is authenticated
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user data to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
