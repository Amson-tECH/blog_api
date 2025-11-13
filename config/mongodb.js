import mongoose from "mongoose";

const conectDB = async () => {
  try {
    // connects to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }
};
export default conectDB;
