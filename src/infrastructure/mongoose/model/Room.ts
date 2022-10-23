import mongoose from "mongoose";
import { StringDecoder } from "string_decoder";
import { TypeMeesage, TypeRoom } from "..//..//..//app/entities/Room";
export default mongoose.model(
  "rooms",
  new mongoose.Schema(
    {
      users: [
        {
          _id: { type: mongoose.Types.ObjectId, require: true, ref: "users" },
          lastMessageRead: { type: mongoose.Types.ObjectId },
          deletedAt: Date,
          missing: { type: Number, default: 0 },
        },
      ],
      messages: [
        {
          _id: String,
          user: { type: mongoose.Types.ObjectId, require: true, ref: "users" },
          content: String,
          type: {
            type: String,
            enum: TypeMeesage,
            default: TypeMeesage.Text,
          },
          reacts: [
            {
              emoji: String,
              user: {
                type: mongoose.Types.ObjectId,
                require: true,
                ref: "users",
              },
              createAt: { type: Date },
            },
          ],
        },
      ],
      typeRoom: {
        type: String,
        enum: TypeRoom,
        default: TypeRoom.Group,
      },
      name: String,
      avatar: String,
    },
    {
      timestamps: true,
      strict: false,
    }
  )
);
