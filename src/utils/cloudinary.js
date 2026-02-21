import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary..
    

    const response = await cloudinary.uploader.upload(path.resolve(localFilePath), {
      resource_type: "auto",
    });

    //file has been uploaded successfully...
    console.log("file has been uploaded successfully!", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // removes the locally saved temporary file as the upload got failed..
    console.log("❌ CLOUDINARY ERROR:", error); 
    return null;

  }
};


export {uploadOnCloudinary};