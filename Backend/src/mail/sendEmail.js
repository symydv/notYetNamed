import axios from "axios";
import "dotenv/config";

export const sendEmail = async(email, subject, templet) => {
  try {
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: {
        name: "Tapes",
        email: process.env.SENDER_EMAIL,
      },

      to: [
        {
          email: email,
        },
      ],

      subject,
      htmlContent: templet,
    },
    {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
    });
    console.log("Mail sent successFully");
  } catch (error) {
    throw new Error("Error sending mail")
  }
}
