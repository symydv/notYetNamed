import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
  {
    targetType: {
      type: String,
      enum: ["video", "comment", "tweet"],
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

likeSchema.index(
  { targetType: 1, targetId: 1, likedBy: 1 },
  { unique: true }
);

export const Like = mongoose.model("Like", likeSchema);
