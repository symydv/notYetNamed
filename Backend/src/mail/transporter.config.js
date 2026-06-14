import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

transporter.verify((err) => {

    if(err){
        console.log("Mail error:", err);
    }
    else{
        console.log("Mail server ready");
    }
});