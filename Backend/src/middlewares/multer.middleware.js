//Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js/Express applications.


import multer from "multer";


const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // directory to save files
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname); // final filename //you can add some random things to your filename as two file names can be same.
  }
  
});


export const upload = multer({ storage }); 
//used in user.routes.js


//steps
/*
1. multer ki help se "upload" banaya.
2. "upload" ko "user.routes.js" me use kiya to get files from user in postman or in website.
3. same route me hamne "registerUser" function bhi use kiya hai.
4. usi "registerUser" me hamne "cloudinary .js" me created "uploadOnCloudinary" function use kiya to upload our files on cloudinary website.
5. aur "uploadOnCloudinary" function me last me hamne dono try and catch me "fs.unlinkSync" ka use kiya hai to syncronously unlink the file from our local disk even if it is uploaded on cloudinary or not, to clear up our local storage.

## aur fir yahi proccess hamne videos me bhi follow kari.
*/