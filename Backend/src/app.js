import express from "express"
import cors from "cors"  //cors: Middleware to enable Cross-Origin Resource Sharing (CORS), allowing your frontend to communicate with your backend.It’s a security feature built into web browsers to control which origins (websites/domains) can access resources on your server via JavaScript (AJAX, fetch, axios).
import cookieParser from "cookie-parser"   //cookie-parser: Middleware to parse cookies from incoming HTTP requests, making them easily accessible in your code.


const app = express()

//app.use() , this is used for all the middlewares and configurations.
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true  // allows cookies and authentication headers to be sent/received across origins.
}))

app.use(express.json({limit: "16kb"}))  //Parses incoming JSON requests, with a size limit of 16kb.
app.use(express.urlencoded({extended: true, limit: "16kb"}))  //Parses URL-encoded data (like form submissions), also with a 16kb limit.
app.use(express.static("public")) // static: This is a built-in middleware function in Express. Serves static files (like images, CSS, JS) from the "public" directory.
app.use(cookieParser())  //Parses cookies from incoming requests and makes them available as req.cookies.


//routes import
import userRouter from "./routes/user.routes.js"  // "userRouter" is a random name and only works when we have used "export default" which we have
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"




//routes declaration
//we are using "app.use()" instead of "app.get()" because we are importing routes from outsides so they act as middleware.
app.use("/api/v1/users", userRouter) //it will direct you to "router" file of user , where we can use .get or .post such methods.
///api/v1/users is standard practice we use.
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export {app}