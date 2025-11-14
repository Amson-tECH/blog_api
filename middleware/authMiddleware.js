import jwt from "jsonwebtoken";
import user from "../models/userModel.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    // Check if token exists 
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. Please log in." });
    }

    //  Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token." });
      }

      const person  = await user.findById(decodedToken.id)

      // Attach user info to request (optional)
      req.user = person;

      console.log("✅ Authenticated user:", decodedToken);
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during authentication." });
  }
};
