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
      friendInvites: [
        {
          userId: {
            type: mongoose.Types.ObjectId,
            require: true,
            ref: "users",
          },
          message: String,
          createdAt: { type: Date, default: new Date() },
        },
      ],
      friends: [
        {
          userId: {
            type: mongoose.Types.ObjectId,
            require: true,
            ref: "users",
          },
          createdAt: { type: Date, default: new Date() },
        },
      ],
    },
    {
      timestamps: true,
      strict: false,
    }
  )
);
