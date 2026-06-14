const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary

        console.log("Uploading:", localFilePath);
        console.log("Type:", typeof localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
    console.log("Cloudinary upload error:");

    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }
    return null;
}
}

module.exports = uploadOnCloudinary;