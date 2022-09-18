import mongoose from "mongoose";
export default mongoose.model(
  "users",
  new mongoose.Schema(
    {
      name: String,
      avatar: String,
      email: String,
      provider: String,
      idProvider: String,
      phone: String,
      sex: Boolean,
      dateOfBirth: Date,
    },
    {
      timestamps: true,
      strict: false,
    }
  )
);
