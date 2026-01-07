
// require("dotenv").config({path: "./env"});  
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})



connectDB()  //async function automatically returns a promise so we can use .then() and .catch() here.
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
    
})













// 1. below is the first approch to connect to a database.
/*
import express from "express"
const app = express()
//connecting database can cause error as it is on another continent
//using async await as db can take time in loading. and also use try catch for error handling

//below code is for imedeate execution of function(note: is line ke pehle wali line ko semicolumn se end karna jaruri hai or it may cause error)
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //below code if db runs but app fails for some reasons
        app.on("error", (error) => {
            console.log("ERROR: ",error);
            throw error  
        })

        //but if it runs
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw err
    }
})()
*/
