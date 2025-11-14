import user from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// jwt token creation
const maxAge = 3 * 24 * 60 * 60; // three days
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
};

// register user
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

    // create token for user --- token to cookie
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({
      success: true,
      message: `${newUser.username} account created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields
    const requiredFields = { email, password };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if email  exists
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found create an account",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const token = createToken(existingUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({
        success: true,
        message: `User ${existingUser.username} signin successfully`,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid password, Login with correct password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//logout user
const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

// get current user
const currentUser = async (req, res) => {
  try {
    const findUser = await user.findOne({ _id: req.user.id });
    if (findUser) {
      res.json({
        success: true,
        user: {
          id: findUser.id,
          name: findUser.name,
          username: findUser.username,
          email: findUser.email,
          bio: findUser.bio,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// user update-profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the logged-in user is allowed to update this profile
    if (req.user.id !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to update this profile",
      });
    }

    // find user from the db
    const userid = await user.findById(userId);
    if (!userid) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // update fields
    const { name, email, username, bio } = req.body;

    if (name) userid.name = name;
    if (email) userid.email = email;
    if (username) userid.username = username; // FIXED
    if (bio !== undefined) userid.bio = bio;

    await userid.save(); // You forgot this!

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: userid.id,
        name: userid.name,
        username: userid.username,
        email: userid.email,
        bio: userid.bio,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { registerUser, loginUser, logout, currentUser, updateProfile };
