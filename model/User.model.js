import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // add salt rounds
  }
  next();
}); //jab bhi password field touch hogi to ye chalega

//this schema can have one more object, usme one of the properties is timestamps -? when you set it to true -> mongoose adds two more fields- createdAt. updatedAt to your schema

const User = mongoose.model("User", userSchema);
//model is a method that takes two parameters:
//first: what do we call this model that we are gonna place in DB
//second:what is the based
//when this User goes into mongoDB everything becomes smallcase and plural but as a standard in our code we write it like this only
//DB me jaake Users ho jayega

export default User;
