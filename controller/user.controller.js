// Importing the User model for interacting with the database (MongoDB via Mongoose)
import User from "../model/user.model.js";

// Importing nodemailer for sending emails
import nodemailer from "nodemailer";

// Importing crypto to generate secure random tokens
import crypto from "crypto";

// Main function to register a new user
const registerUser = async (req, res) => {
  // Destructure user data from the request body (sent from frontend)
  const { name, email, password } = req.body || {};

  // Basic validation: Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Check if a user with the given email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create a new user in the database
    // ⚠️ Note: You should hash the password before saving in production (e.g., using bcrypt)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Safety check: ensure user was actually created
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    // Generate a secure random token for email verification
    const token = crypto.randomBytes(32).toString("hex");
    console.log("Verification token:", token); // Useful for debugging (remove in production)

    // Save the token to the user model (assumes user schema has 'verificationToken' field)
    user.verificationToken = token;
    await user.save();

    // Create a transporter object to send emails via Mailtrap SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST, // SMTP host (Mailtrap)
      port: process.env.MAILTRAP_PORT, // SMTP port
      auth: {
        user: process.env.MAILTRAP_USER, // Securely stored Mailtrap username
        pass: process.env.MAILTRAP_PASS, // Securely stored Mailtrap password
      },
    });

    // Define the email to be sent
    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL, // Sender email (should match verified sender in Mailtrap)
      to: user.email, // Recipient's email address
      subject: "Verify your email", // Subject line
      text: `Please click the following link to verify your email: ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // Plain text version
      html: `<p>Please click the following link to verify your email:</p>
             <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}">Verify Email</a>`, // HTML version for rich emails
    };

    // Send the email with the verification link
    await transporter.sendMail(mailOption);

    // Respond with a success message if everything went well
    res.status(200).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    // Catch any unexpected errors and return server error response
    console.error("Error during user registration:", error);
    res.status(500).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from url
  //validate token
  //NOTE: agar mai kisi user ko email ke basis pe find kar sakta hun to mai uss user ko token ke basis pe bhi to find kar sakta hun
  //find user based on token
  //if not
  // set isVerified field to true
  //remove verificationTOken
  //save
  //return response

  const { token } = req.params;
  console.log(token);
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  const user = await User.findOne({ verificationToken: token });
};
if (!user) {
  return res.status(400).json({
    message: "Invalid token",
  });
}
user.isVerified = true;
user.verificationToken = undefined;
await user.save();

export { registerUser, verifyUser };
