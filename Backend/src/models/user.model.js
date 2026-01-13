import mongoose, {Schema} from "mongoose";  //Schema isliye taki baar baar mongoose.Schema na likhna pade.
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { type } from "os";



const userschema = new Schema(
    {
    
    watchHistory:[ 
        {
        type: Schema.Types.ObjectId,
        ref: "video"
        }
    ],
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
    },
    coverImage: {
        type: String //cloudinary url
    },
    password: {
        type: String,
        required: [true, "password is required"],
        // select:false      // so that on any call of "User" password field is not returned.but right now we are not adding it because we have to change our login (baad me karenge.)
    },
    subscriberCount:{     //added later on 13/01/26, used in toggel subscription to increase and decrease it there and shown on player page.
        type: Number,
        default:0
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String
    },
    emailVerificationExpiry:{
        type: Date
    }
    },
    {
        timestamps: true
    }
)


//######## Password Hashing with pre("save") Hook ################

//pre() is a hook :In Mongoose, the pre method is used to define middleware that runs before a certain action (like saving, validating, or removing a document) occurs.
//pre() me kripya arrow function na use kare kyuki arrow function me "this" use nahi kar sakte par isme "this" ki jarurat hai.
//  "save", matlab just save hone se pehle kuch use karna hai.
userschema.pre("save", async function(next){  //using async as it may take some time.
    if(!this.isModified("password")) return next() //we used this line so that this code for encrypting password only runs when user is first time creating the password or modifying it. so it says if not modifying move to next task directly
    this.password = await bcrypt.hash(this.password, 10) //10 is just rounds do encryption it can be any number
    next() //"next" ko last me call kiya hai because we want to move on to save, after encrypting our password.
})


//we can also create our own methods using .methods.methodName, like here we created "isPasswordCorrect" method
userschema.methods.isPasswordCorrect = async function 
(password) {
    return await bcrypt.compare(password, this.password)   //compares given password with saved password on database.
}

userschema.methods.generateAccessToken = function(){ 
    //is process me time nahi lagata hai.
    return jwt.sign(
        //1. payload 
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        //2. accesse token
        process.env.ACCESS_TOKEN_SECRET,
        //3. expiry
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Term	What It Is
// ACCESS_TOKEN_SECRET ->	🔐 Private key to sign and verify tokens (never sent to client)
// Access token (JWT) ->	📜 The actual string you generate with jwt.sign() and send to the client
// Token content ->	 👤 Encoded payload (like user ID, email) + digital signature

//These methods generate signed JWTs for authentication and session management, using user info and secret keys from your environment variables.
userschema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userschema);
