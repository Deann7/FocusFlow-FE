require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = (file, folder) => {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null); 
        
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        cloudinary.uploader.upload(dataURI, {
            folder: folder,
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        });
    });
};

module.exports = {
    uploadFile,
    ...cloudinary
};