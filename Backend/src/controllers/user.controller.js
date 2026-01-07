import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { v2 as cloudinary} from "cloudinary"


//for later use in the code.
const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //save refresh token on database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) //dont validate here just save.

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async(req, res) => {
    //1. get user details from frontend. (using postman we can get user details instead of frontend using our "user models")
    //2. validation - not empty
    //3. check if user already exists.(using username, email)
    //4. check for images, check for avatar.
    //5. upload them t0 cloudinary, avatar check if it gets uploaded or not
    //6. create user object - create entry in db.
    //7. remove password and refresh token field from response.
    //8. check for user creation , it happened or not
    //9. return res

    //1.
    const {fullName, email, username, password} = req.body
    // console.log("email: ",email);

    //2.
    if (
        //.some() goes through the array and checks if at least one of the fields meets the condition:
        [fullName, email, username, password].some((field) => field?.trim() === "") 
        //field might be undefined, so we use optional chaining (?.) to avoid errors.
        // .trim() removes any leading/trailing spaces, so " " becomes "".
        //ye code pehle to sabhi field leta hai out of four fields we have provided then it checks that if the field is empty if so it returns true.{use AI to understand}, if we have not used this method we could have directly checked them using if( fullname === "" ) and so for all the fields separately
    ) {
        throw new ApiError(400, `All fields are required`) //using our already created function for Error handling.
    }
    
    //3.
    const existedUser = await User.findOne({ //This is a Mongoose method that searches for a single user in the database.
        $or: [{ username }, { email }]  //$or is a MongoDB operator that allows you to specify multiple conditions.It returns documents that match at least one of the conditions.
        //Find a user where the username matches the provided username OR the email matches the provided email.
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    // console.log(req.files); //just to check what is this 
    // console.log(req.body); //just to check what is this 
    

    //4.
    const avatarLocalPath = req.files?.avatar[0]?.path; //This line safely gets the file path of the uploaded avatar image, if it exists.
    // req.files:
    // This is an object that contains files uploaded by the user (usually when using a middleware like multer for handling multipart/form-data).

    // ?. (optional chaining):
    // This checks if the property exists before trying to access it, preventing errors if something is undefined or null.

    // avatar:
    // This is the field name for the uploaded file (e.g., <input type="file" name="avatar" /> in your frontend form).

    // [0]:
    // If multiple files are uploaded under the same field, they are stored as an array. [0] gets the first file.

    // path:
    // This is the location (on disk or in temp storage) where the uploaded file is saved.

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //or  //check on AI why we used below method.
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image is required") //coverimage is not neccessarily  required as we have saved in models
    }
    
    //5.
    const avatar = await uploadOnCloudinary(avatarLocalPath) //you have to wait till this process is finished.
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar image is required")
    }

    //6.
    const user = await User.create({ //Used to insert a new document into a MongoDB collection (database)
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //as we have not checked that coverImage is provided or not
        email,
        password,
        username: username.toLowerCase()
    })
    

    //7. and 8.
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // '-' ke baad jo bhi likha hai wo hame nahi chahiye hota hai to wo database me show nahi hoga
    ) 
    //db automatically creates "_id" for each data block

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user.")
    }

    //9.
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered successfully")
    )






    })

const loginUser = asyncHandler( async(req, res) => {
    //ToDos.
    //1. take email/username and password from frontend/postman.
    //2. match email/username to any of the stored one.
    //3. if matched verify corresponding password. 
    //4. provide refresh and access token.
    //5. send cookie.


    //1.
    const {email, username, password} = req.body

    if (!username && !email) {  //both cant be null any one is required.
        throw new ApiError(400, "username or email is required")
    }

    //2.
    const user  = await User.findOne({ //find first document with same username or password saved , which we wanted.
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "user does not exists")
    }

    //3.
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //4.
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")  //optional step

    const option = {
        httpOnly: true,
        secure: true
    } //understand 

    //5.
    return res.status(200)
    .cookie("accessToken", accessToken,option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(
            200, 
            {
            user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successFully"
        )
    )
})


const logoutUser = asyncHandler(async(req, res) => {
    //how do we get access to "user" here, this secrete lies in "verifyJWT" middleware check on AI.
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1 //this removes the field from document
            }
        },
        {
            new: true
        }
    )
    
    console.log("User in logout:", req.user) //jsut to check if we are getting the correct user.

    const options = {
        httpOnly: true, //JS on the client can’t access these cookies (prevents XSS)
        secure: true  //Cookie only sent over HTTPS
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {user: req.user}, `User loggedOut successfully.`))
})



// some points about our below function "refreshAccessToken"

// ❌ The backend route does not run by itself.

// ✅ The frontend must explicitly call it when it detects:

// should call when accessToken has expired (usually via 401 response).


// Or, user is opening the app after a long time
const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id) //to store in database.
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)  //we are able to use req.user because we are using verfyJWT middleware in routes.
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) //retruns true/false

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword //new password will automatically bcrypt as we have written code for it in usermodel.
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successFully"))

})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfullly."))
})


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400 , "All feilds are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email //when both sides are same we can directly write here just "email" , as we have written above for "fullName"
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully."))
})


//Professionally always try to update files saperately from text data, as we are doing here.
//as it makes it easy to just change your profile picture separately without have to go to update profile section.
const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path //req.file is accesseble through "multer"

    //##TODO: after complete process delete the previos avatar image.


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading on avatar.")
    }

    const userOld = await User.findById(req.user?._id)
    if (!userOld) {
        throw new ApiError(404, "user not found")
    }

    if(userOld.avatar){
        const segments = userOld.avatar.split("/")
        const fileWithExt = segments.at(-1)
        const folder = segments.at(-2)
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`
        await cloudinary.uploader.destroy(publicId)
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")
     

    return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar Updated successfully"))
})
const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path //req.file is accesseble through "multer"

    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing.")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading on coverImage.")
    }

    const userOld = await User.findById(req.user?._id)
    if (!userOld) {
        throw new ApiError(404, "user not found")
    }

    if(userOld.coverImage){
        const segments = userOld.coverImage.split("/")
        const fileWithExt = segments.at(-1)
        const folder = segments.at(-2)
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`
        await cloudinary.uploader.destroy(publicId)
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage Updated successfully"))
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params //req.params is a property provided by Express.js that contains route parameters — these are parts of the URL defined in your route path using

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        }, //till these pipeline we have sorted out the users/user with required username now the next pipeline will be applied on those/that filtered users/user.
        {
            //to look for who subscribe me.
            $lookup: {
                //remember models me export pe sab lowercase and plural ho jata hai
                from: "subscriptions" , // Name of the collection to join.
                localField: "_id",       // Field from input documents which is "User" here
                foreignField: "channel",   // Field from 'from' collection
                as: "subscribers"    // Name of the new array field to add
            }
        },
        {
            // to look for, whom i subscribed.
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            //add new fields .
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers" //use "$" signs for fields
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]}, // Checks if req.user._id exists in the subscribers.subscriber array
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: { //which things to show.
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    //channel will be an array

    if (!channel || channel.length === 0) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, channel[0], "user channel fetched successfully."))
})


const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id) // we can not use req.user._id here in aggregation pipelines :-
                //In MongoDB, the _id field is typically of type ObjectId, not a string.
                // When using aggregation pipelines, MongoDB performs strict type matching — meaning:
                // Even if the string value of req.user._id matches the document’s _id, MongoDB will not match unless both the value and type match. 
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [  //can be used to apply pipelines inside other pipelines. as we are applying loop on videos so the next lookup will be on videos model
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}