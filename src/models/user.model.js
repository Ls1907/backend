import mongoose, { Schema } from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrpyt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    watchhistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    coverimage: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) { // hook to encrypt password before saving in database..
  if (!this.ismodified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  next();
};

userSchema.methods.generateAccessToken = function () {
 return  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry goes in an object..
    }
  );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
      {
        _id: this._id,
       
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry goes in an object..
      }
    );
}

export const user = mongoose.model("User", userSchema);
