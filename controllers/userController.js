import user from "../models/userModel.js";
import validator from "validator";

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, bio } = req.body;

    // Required fields
    const requiredFields = { name, username, email, password, bio };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // validate email format
    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    // check for strong password
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be six characters long",
      });
    }

    // create user to DB
    const newUser = await user.create({ name, username, email, password, bio });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser };
