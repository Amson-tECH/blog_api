import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: {
      type: String,
      required: [true, "Please enter a username!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email!"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter an password!"],
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const user = new mongoose.model("Users", userSchema);


export default user