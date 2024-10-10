const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");


exports.deleteImage = (model, modelName, FolderName) =>
    asyncHandler(async (req, res, next) => {
      const document = await model.findById(req.params.id);
  
      if (!document || !document.image) {
        return next(
          new ApiError(
            `No image found for this ${modelName} (Id: ${req.params.id})`,
            404
          )
        );
      }
  
      const imageUrl = document.image;
  
      const getPublicId = (imageUrl) => {
        const parts = imageUrl.split("/");
        const lastPart = parts.pop();
        const publicId = lastPart.split(".")[0];
        return `Tandn-shop/${FolderName}/${publicId}`;
      };
  
      const publicId = getPublicId(imageUrl);
  
      if (!publicId) {
        return next(
          new ApiError(`Invalid public_id format (Id: ${req.params.id})`, 400)
        );
      }
  
      try {
        const result = await cloudinary.uploader.destroy(publicId);
  
        if (result.result === "ok") {
          next();
        } else {
          return next(
            new ApiError(`Failed to delete image from Cloudinary ${result}`, 500)
          );
        }
      } catch (error) {
        return next(
          new ApiError(
            `Error deleting image from Cloudinary ${error.message}`,
            500
          )
        );
      }
    });
  
  
  exports.ImageProssing =(modelNmae,folderName)=> asyncHandler(async (req, res, next) => {
      if (req.file && req.file.buffer) {
        const filename = `${modelNmae}-${uuidv4()}-${Date.now()}.jpeg`;
        
       
        const publicId = filename.split('.')[0]; // استخدام اسم الصورة بدون الامتداد
    
        try {
          const processedImageBuffer = await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();
    
          // استخدام public_id عند رفع الصورة إلى Cloudinary
          const cloudinaryResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                public_id: publicId, // تعيين public_id
                folder: `Tandn-shop/${folderName}`,
              },
              (error, result) => {
                if (error) {
                  console.error("Error uploading image using Cloudinary:", error);
                  reject(new Error("Error uploading image using Cloudinary"));
                } else {
                  resolve(result);
                  console.log(publicId)
                }
              }
            );
    
            stream.end(processedImageBuffer);
          });
    
          req.body.image = cloudinaryResponse.secure_url; 
          next();
        } catch (error) {
          return res.status(500).json({ message: error.message || "Image Processing Error" });
        }
      } else {
        next();
      }
    });
    