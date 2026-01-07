
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"  //used for managing files.


//below code is pasted from cloudinary website.
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

//making a function named "uploadOnCloudinary()"
const uploadOnCloudinary = async (LocalFilePath) => {
    try {
        if(!LocalFilePath) return null
        //upload the file on cloudinary.
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            //read cloudinary documentation to know about more options.
            folder: "Image",
            resource_type: "auto"  //means which type of file you want to upload eg: image, video etc.
        })
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(LocalFilePath) //it is a multer method to delete file from local storage, after successfully uploading it to cloudinary
        return response;
        
    } catch (error) {
        
        fs.unlinkSync(LocalFilePath)  //remove the localy(on our server) saved temporary file as the upload operation got failed.
        return null ;
    }
}




export {uploadOnCloudinary}



















    
