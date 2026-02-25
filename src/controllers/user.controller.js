import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //save in database without validating other fields like password used for saving refreshtoken..

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // console.log("INSIDE CONTROLLER");
  //console.log(req.files);
  // console.log("BODY:", req.body);
  // console.log("FILES:", req.files);
  // console.log(Object.keys(req.files));
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "user already existing with this username or email"
    );
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  console.log(avatarLocalPath);
  //const coverImagePath = req.files?.coverImage[0].path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "usernmae or email required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existingUser) {
    throw new ApiError(404, "No user found please register!");
  }

  if (!password) {
    throw new ApiError(400, "password cant be empty!");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect!");
  }

  const {refreshToken,accessToken} =  await generateAccessAndRefreshTokens(existingUser._id)

  const loggedInUser = await User.findById(existingUser._id).select("-password,-refreshToken")
  const options ={
    httpOnly: true,
    secure : true
  }

  res.status(200)
  .cookie("accessToken", accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user : loggedInUser,accessToken,refreshToken

      },
      "User logedin successfully!!"
    )
  )
});

const logoutUser = asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,
  {
    $set:{refreshToken:undefined}


  },
  {
    new: true

  }
)

const options = {
  httpOnly: true,
  secure: true,
};

return res.
status(200).
clearCookie("accessToken",options).
clearCookie("refreshToken", options).
json(new ApiResponse(200,{},"USer logged out!"))
})
export {logoutUser, registerUser, loginUser };
