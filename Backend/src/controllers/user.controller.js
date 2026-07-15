import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { v2 as cloudinary} from "cloudinary"
import { sendEmail } from "../mail/sendEmail.js";
import { verificationTemplate, PASSWORD_RESET_TEMPLATE} from "../mail/emailTemplets.js";
import crypto from "crypto"
import { Video } from "../models/video.model.js";
import { cookieOptions } from "../utils/CookieOptions.js";

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
    //3. check if user already exists.(using username, email) and is he verified or not, if not verified send verification token again.
    //4. create user object - create entry in db and send verification email.
    //5. return res

    //1.
    const {fullName, email, username, password} = req.body
    // console.log("email: ",email);

    //2.
    if (
        //.some() goes through the array and checks if at least one of the fields meets the condition:
        [fullName, email, username, password].some((field) => !field || field?.trim() === "") 
        //field might be undefined, so we use optional chaining (?.) to avoid errors.
        // .trim() removes any leading/trailing spaces, so " " becomes "".
        //ye code pehle to sabhi field leta hai out of four fields we have provided then it checks that if the field is empty if so it returns true.{use AI to understand}, if we have not used this method we could have directly checked them using if( fullname === "" ) and so for all the fields separately
    ) {
        throw new ApiError(400, `All fields are required`) //using our already created function for Error handling.
    }
    if (username.includes("@")) {
        throw new ApiError(400, "Username cannot contain @")
    }
    
    //3.
    const existedUser = await User.findOne({ //This is a Mongoose method that searches for a single user in the database.
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]  //$or is a MongoDB operator that allows you to specify multiple conditions.It returns documents that match at least one of the conditions.
        //Find a user where the username matches the provided username OR the email matches the provided email.
    })

    if (existedUser) {
        if(existedUser.email.toLowerCase() !== email.toLowerCase()){
            throw new ApiError(
                409,
                "Username already taken"
            );
        }
        if(existedUser.isEmailVerified){
            throw new ApiError(409, "User with email or username already exists")
        }else{
            existedUser.username = username.toLowerCase();
            existedUser.password = password;
            existedUser.fullName = fullName;
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            existedUser.emailVerificationToken = verificationToken;
            existedUser.emailVerificationExpiry = Date.now() +  1*60*60*1000; // 1hour from now
            try {
                await sendEmail(existedUser.email, "verify your email", verificationTemplate(verificationToken))
                await existedUser.save({validateBeforeSave:false}); 
                return res.status(200).json(new ApiResponse(200, {email: existedUser.email}, " Verification code sent again"))
            } catch (error) {
                console.log("1")
                throw new ApiError(500, "Something went wrong while sending verification email. Please try again lateer.")
            }
            
        }
    }


    // console.log(req.files); //just to check what is this 
    // console.log(req.body); //just to check what is this 
    
    //4.
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); //generating random 6 digit number as verification token.
    const user = await User.create({ //Used to insert a new document into a MongoDB collection (database)
        fullName,
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: Date.now() + 1*60*60*1000 // 1hour from now
    })
    
    try {
        await sendEmail(user.email, "verify your email", verificationTemplate(verificationToken)) //sending email to user for verification.
    } catch (error) {
        await User.findByIdAndDelete(user._id) //if email sending fails then we will delete the created user from database as email verification is must for our app.
        console.log("2")
        throw new ApiError(500, "Something went wrong while sending verification email. Please try again laterr.")
    }
    
    //5.
    return res.status(201).json(
        new ApiResponse(201, {email: user.email}, "User Registered successfully")
    )

})

const verifyEmail = asyncHandler(async(req, res) => {
    const {email, verificationToken} = req.body
    if(!email || !verificationToken){
        throw new ApiError(400, "Email and verification token are required")
    }
    try {
        const user = await User.findOne({
            email: email.toLowerCase(),
            emailVerificationToken: verificationToken,
            emailVerificationExpiry: {$gt: Date.now()} //to check that token is not expired.
        })

        if(!user){
            throw new ApiError(400, "Invalid or expired verification token")
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save({validateBeforeSave:false});
        return res.status(200).json(new ApiResponse(200, {email: user.email}, "Email verified successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while verifying email. Please try again later.")  
    }
    
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
        $or: [{username: username?.toLowerCase()}, {email: email?.toLowerCase()}]
    })

    if (!user) {
        throw new ApiError(404, "user does not exists")
    }

    //3
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    if(!user.isEmailVerified){
        throw new ApiError(401, "Email not verified. Please verify your email to login.")
    }

    //4.
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    // const option = {
    //     httpOnly: true,
    //     secure: true
    // } //understand 
    const options = cookieOptions;
    //5.
    return res.status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
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
    
    // console.log("User in logout:", req.user) //jsut to check if we are getting the correct user.

    // const options = {
    //     httpOnly: true, //JS on the client can’t access these cookies (prevents XSS)
    //     secure: true  //Cookie only sent over HTTPS
    // }
    const options = cookieOptions

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {user: req.user}, `User loggedOut successfully.`))
})



// some points about our below function "refreshAccessToken"

//  The backend route does not run by itself.

//  The frontend must explicitly call it when it detects:

// should call when accessToken has expired (usually via 401 response).


// Or, user is opening the app after a long time
const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

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
            secure: true,
            ...cookieOptions,
            maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
        }
    
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id) //to store in database.
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: refreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email.toLowerCase()});
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");
    const resetPasswordExpiresAt = Date.now() + 1*60*60*1000; //1hour

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetPasswordExpiresAt;
    await user.save();

    try {
        await sendEmail(user.email, "Reset password", PASSWORD_RESET_TEMPLATE(`${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`)); //reset url
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        throw new ApiError(500, "Couldn't send reset email");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset link sent to your email"))
})

const resetPassword = asyncHandler(async(req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken : hashedToken,
        resetPasswordExpires: {$gt: Date.now()}
    })
    if(!user){
        throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully."))
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

    const userOld = await User.findById(req.user?._id)
    if (!userOld) {
        throw new ApiError(404, "user not found")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar?.url){
        throw new ApiError(400, "Error while uploading on avatar.")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:{
                    url: avatar.url,
                    public_id: avatar.public_id
                }
            }
        },
        {new: true}
    ).select("-password")

    if(userOld.avatar?.public_id){
        await cloudinary.uploader.destroy(userOld.avatar.public_id); //delete the previous avatar from cloudinary
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar Updated successfully"))
})
const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path //req.file is accesseble through "multer"

    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing.")
    }

    const userOld = await User.findById(req.user?._id)
    if (!userOld) {
        throw new ApiError(404, "user not found")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage?.url){
        throw new ApiError(400, "Error while uploading on coverImage.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:{
                    url: coverImage.url,
                    public_id: coverImage.public_id
                }
            }
        },
        {new: true}
    ).select("-password")

    if(userOld.coverImage?.public_id){
        await cloudinary.uploader.destroy(userOld.coverImage.public_id)
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {coverImage: user.coverImage}, "coverImage Updated successfully"))
})

const getWatchHistory = asyncHandler(async(req, res) => {
    // const user = await User.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(req.user._id) // we can not use req.user._id here in aggregation pipelines :-
    //             //In MongoDB, the _id field is typically of type ObjectId, not a string.
    //             // When using aggregation pipelines, MongoDB performs strict type matching — meaning:
    //             // Even if the string value of req.user._id matches the document’s _id, MongoDB will not match unless both the value and type match. 
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "videos",
    //             localField: "watchHistory",
    //             foreignField: "_id",
    //             as: "watchHistory",
    //             pipeline: [  //can be used to apply pipelines inside other pipelines. as we are applying loop on videos so the next lookup will be on videos model
    //                 {
    //                     $lookup: {
    //                         from: "users",
    //                         localField: "owner",
    //                         foreignField: "_id",
    //                         as: "owner",
    //                         pipeline: [
    //                             {
    //                                 $project: {
    //                                     fullName: 1,
    //                                     username: 1,
    //                                     avatar: 1
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 },
    //                 {
    //                     $addFields: {
    //                         owner:{
    //                             $first: "$owner"
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // ])
    const user = await User
        .findById(req.user._id)
        .populate({
            path: "watchHistory",
            populate: {
                path: "owner",
                select: "fullName username avatar"
            }
        })

    return res
    .status(200)
    .json(new ApiResponse(200, user.watchHistory, "Watch history fetched successfully"))
})

const addToHistory = asyncHandler(async(req, res) => {
    const {videoId} = req.params;

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    // pull(remove) any previos instances of this video from history. 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull:{
                watchHistory: videoId
            }
        }
    );

    // push(add) this video to position 0 (front)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push:{
                watchHistory:{
                    $each : [videoId],
                    $position: 0,
                }
            }
        }
    );
    //TODO: Later implement both pull and push in single database operations.

    return res.status(200).json(new ApiResponse(200, {}, "Video added to watch history"));
})

const deleteWatchHistory = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                watchHistory: []
            }
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Watch history deleted successfully"))
})

const removeFromWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { watchHistory: videoId } },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video removed from watch history"));
});

export {
    registerUser,
    verifyEmail,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
    addToHistory,
    deleteWatchHistory,
    removeFromWatchHistory
}