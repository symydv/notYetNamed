export const verificationTemplate = (token) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <div style="max-width: 600px; margin: auto; padding: 20px;">

      <h2>Email verification</h2>

      <p>Hello,</p>

      <p>
        Thank you for creating an account. Please use the verification
        code below to complete your email verification.
      </p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        margin: 25px 0;
      ">
        ${token}
      </div>

      <p>
        This verification code will expire shortly for security reasons.
      </p>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>

      <br/>

      <p>
        Regards,<br/>
        Auth Team
      </p>

    </div>

  </body>
  </html>
  `;
};

export const welcomeTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <div style="max-width:600px; margin:auto; padding:20px;">

      <h2>Welcome, ${name}</h2>

      <p>
        Your account has been created successfully.
      </p>

      <p>
        You can now sign in and start using your account.
      </p>

      <p>
        We are happy to have you with us.
      </p>

      <br/>

      <p>
        Regards,<br/>
        Auth Team
      </p>

    </div>

  </body>
  </html>
  `;
};

export const PASSWORD_RESET_TEMPLATE = (resetURL) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="
    font-family: Arial, sans-serif;
    background-color:#f4f4f4;
    padding:20px;
  ">

    <div style="
      max-width:600px;
      margin:auto;
      background:white;
      padding:30px;
      border-radius:10px;
    ">

      <h2 style="color:#333;">
        Reset Your Password
      </h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to create a new password:
      </p>


      <a href="${resetURL}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#4f46e5;
          color:white;
          text-decoration:none;
          border-radius:5px;
          margin:20px 0;
        "
      >
        Reset Password
      </a>


      <p>
        This link will expire in <b>1 hour</b>.
      </p>


      <p style="color:#777;font-size:14px;">
        If you did not request this, you can safely ignore this email.
      </p>


    </div>

  </body>
  </html>
  `;
};