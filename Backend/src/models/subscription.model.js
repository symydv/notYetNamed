import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, //one to whom we are subscribing.
        ref: "User"
    }
}, {timestamps: true})

// 🔒 Prevent duplicate subscriptions
subscriptionSchema.index(
  { subscriber: 1, channel: 1 },
  { unique: true }
);


export const Subscription = mongoose.model("Subscription", subscriptionSchema)