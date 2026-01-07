import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//connecting database can cause error as it is on another continent
//using async await as db can take time in loading. and also use try catch for error handling

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection FAILED: ", error);
        process.exit(1) //it is a Node.js method read about it
    }

}


export default connectDB