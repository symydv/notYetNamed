import { transporter } from "./transporter.config.js";

export const sendEmail = async(email, subject, templet) => {
  try {
    await transporter.sendMail({
      from: "Tapes",
      to: email,
      subject,
      text: "This is an account notification email.",
      html: template
    })
    console.log("Mail sent successFully");
  } catch (error) {
    throw new Error("Error sending mail")
  }
}