import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //duration bhi claudnary website automatically de dega.
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)
//videoSchema is your Mongoose schema for videos.
// .plugin() is a Mongoose method that lets you add reusable functionality (a plugin) to your schema.
// mongooseAggregatePaginate is a plugin that adds pagination support to Mongoose's .aggregate() queries.
//Pagination is the process of dividing a large set of data into smaller, manageable chunks (pages), so you only display or process a limited number of items at a time.

export const Video = mongoose.model("Video", videoSchema)