import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

    // Configuration from cloudanry site
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async (localFilePath)=>{
        try{
            if(!localFilePath) return null;
            //upload file cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : "auto"
            });
            //file successfully uploaded 
            console.log("file successfully uploaded cloudinary", response.url);
            fs.unlinkSync(localFilePath); // remove the locally saved temp file as a upload fails 
            return response;

        }catch(error){
            fs.unlinkSync(localFilePath); // remove the locally saved temp file as a upload fails 
        }
    }

    export {uploadOnCloudinary}
    