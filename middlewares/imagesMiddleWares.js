const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.deleteImage = (model, modelName, FolderName) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findById(req.params.id);

    if (!document) {
      return next(
        new ApiError(
          `No document found for this ${modelName} (Id: ${req.params.id})`,
          404
        )
      );
    }

    if (document.image) {
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
            new ApiError(
              `Failed to delete image from Cloudinary ${result}`,
              500
            )
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
    } else {
      next();
    }
  });

exports.ImageProssing = (modelNmae, folderName) =>
  asyncHandler(async (req, res, next) => {
    if (req.file && req.file.buffer) {
      const filename = `${modelNmae}-${uuidv4()}-${Date.now()}.png`;

      const publicId = filename.split(".")[0]; // استخدام اسم الصورة بدون الامتداد

      try {
        const processedImageBuffer = await sharp(req.file.buffer)
        
          .toFormat("png")
          .png({ quality: 90 })
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
                reject(new Error("Error uploading image using Cloudinary"));
              } else {
                resolve(result);
              }
            }
          );

          stream.end(processedImageBuffer);
        });

        req.body.image = cloudinaryResponse.secure_url;
        next();
      } catch (error) {
        return next(new ApiError("Image Processing Error", 500));
      }
    } else {
      next();
    }
  });

exports.updateImage = (model, modelName, folderName) =>
  asyncHandler(async (req, res, next) => {
    // البحث عن المستند باستخدام الـ ID
    const document = await model.findById(req.params.id);
    if (!document) {
      return next(new ApiError(`No ${modelName} found for this ID`, 404));
    }

    // التحقق من وجود صورة جديدة للرفع
    if (req.file && req.file.buffer) {
      const imageUrl = document.image;

      // دالة لاستخراج Public ID من رابط Cloudinary
      const getPublicId = (imageUrl) => {
        const parts = imageUrl.split("/");
        const lastPart = parts.pop();
        const publicId = lastPart.split(".")[0];
        return `Tandn-shop/${folderName}/${publicId}`;
      };

      if (imageUrl) {
        // حذف الصورة القديمة من Cloudinary
        const publicId = getPublicId(imageUrl);
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result !== "ok") {
            return next(
              new ApiError(
                `Failed to delete image from Cloudinary: ${result.result}`,
                500
              )
            );
          }
        } catch (error) {
          return next(
            new ApiError(
              `Error deleting image from Cloudinary: ${error.message}`,
              500
            )
          );
        }
      }

      // معالجة الصورة الجديدة ورفعها
      const filename = `${modelName}-${uuidv4()}-${Date.now()}.png`;
      const newPublicId = filename.split(".")[0];

      try {
        const processedImageBuffer = await sharp(req.file.buffer)
        
          .toFormat("png")
          .png({ quality: 90 })
          .toBuffer();

        const cloudinaryResponse = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: newPublicId,
              folder: `Tandn-shop/${folderName}`,
            },
            (error, result) => {
              if (error) {
                reject(new Error("Error uploading image using Cloudinary"));
              } else {
                resolve(result);
              }
            }
          );

          stream.end(processedImageBuffer);
        });

        // تحديث رابط الصورة في المستند
        document.image = cloudinaryResponse.secure_url;
        await document.save();

        next();
      } catch (error) {
        return next(new ApiError("Image Processing Error", 500));
      }
    } else {
      next();
    }
  });

exports.resizeProductImages = (modelName, folderName) =>
  asyncHandler(async (req, res, next) => {
    // 1- Image processing for imageCover
    if (req.files.imageCover && req.files.imageCover[0].buffer) {
      const imageCoverFileName = `${modelName}-${uuidv4()}-${Date.now()}-cover.png`;
      const publicIdCover = imageCoverFileName.split(".")[0]; // استخدام اسم الصورة بدون الامتداد

      try {
        const processedImageCoverBuffer = await sharp(
          req.files.imageCover[0].buffer
        )
          .resize(2000, 1333)
          .toFormat("png")
          .png({ quality: 95 })
          .toBuffer();

        // رفع الصورة إلى Cloudinary باستخدام public_id
        const cloudinaryResponseCover = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: publicIdCover,
              folder: `Tandn-shop/${folderName}`,
            },
            (error, result) => {
              if (error) {
                console.error(
                  "Error uploading imageCover to Cloudinary:",
                  error
                );
                reject(new Error("Error uploading imageCover to Cloudinary"));
              } else {
                resolve(result);
              }
            }
          );
          stream.end(processedImageCoverBuffer);
        });

        // حفظ الرابط في قاعدة البيانات
        req.body.imageCover = cloudinaryResponseCover.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ message: error.message || "ImageCover Processing Error" });
      }
    }

    // 2- Image processing for images
    if (req.files.images) {
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (img, index) => {
          if (img.buffer) {
            const imageName = `${modelName}-${uuidv4()}-${Date.now()}-${
              index + 1
            }.png`;
            const publicIdImage = imageName.split(".")[0]; // استخدام اسم الصورة بدون الامتداد

            try {
              const processedImageBuffer = await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat("png")
                .png({ quality: 95 })
                .toBuffer();

              // رفع الصورة إلى Cloudinary باستخدام public_id
              const cloudinaryResponseImage = await new Promise(
                (resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                    {
                      public_id: publicIdImage,
                      folder: `Tandn-shop/${folderName}`,
                    },
                    (error, result) => {
                      if (error) {
                        console.error(
                          `Error uploading image ${index + 1} to Cloudinary:`,
                          error
                        );
                        reject(
                          new Error(
                            `Error uploading image ${index + 1} to Cloudinary`
                          )
                        );
                      } else {
                        resolve(result);
                      }
                    }
                  );
                  stream.end(processedImageBuffer);
                }
              );

              // حفظ الرابط في قاعدة البيانات
              req.body.images.push(cloudinaryResponseImage.secure_url);
            } catch (error) {
              return res
                .status(500)
                .json({ message: error.message || "Image Processing Error" });
            }
          }
        })
      );
    }

    next();
  });

exports.deleteProductCoverImageAndImages = (model, modelName, folderName) =>
  asyncHandler(async (req, res, next) => {
    // 1- البحث عن الوثيقة بناءً على المعرف
    const document = await model.findById(req.params.id);

    if (!document) {
      return next(
        new ApiError(
          `No ${modelName} found with this ID: ${req.params.id}`,
          404
        )
      );
    }

    // 2- تعريف دالة getPublicId لاستخراج public_id من رابط الصورة
    const getPublicId = (imageUrl) => {
      const parts = imageUrl.split("/");
      const lastPart = parts.pop();
      const publicId = lastPart.split(".")[0];
      return `Tandn-shop/${folderName}/${publicId}`;
    };

    // 3- حذف صورة الغلاف (imageCover) إذا كانت موجودة
    if (document.imageCover) {
      const imageCoverUrl = document.imageCover;

      const publicId = getPublicId(imageCoverUrl);

      if (!publicId) {
        return next(
          new ApiError(`Invalid public_id format (Id: ${req.params.id})`, 400)
        );
      }

      try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
          return next(
            new ApiError(
              `Failed to delete imageCover from Cloudinary: ${JSON.stringify(
                result
              )}`,
              500
            )
          );
        }
      } catch (error) {
        return next(
          new ApiError(
            `Error deleting imageCover from Cloudinary: ${
              error.message || JSON.stringify(error)
            }`,
            500
          )
        );
      }
    }

    // 4- حذف جميع الصور في مصفوفة images إذا كانت موجودة
    if (document.images && document.images.length > 0) {
      await Promise.all(
        document.images.map(async (imageUrl) => {
          const publicId = getPublicId(imageUrl);

          if (!publicId) {
            return next(
              new ApiError(
                `Invalid public_id format for one of the images (Id: ${req.params.id})`,
                400
              )
            );
          }

          try {
            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result !== "ok") {
              return next(
                new ApiError(
                  `Failed to delete image from Cloudinary: ${JSON.stringify(
                    result
                  )}`,
                  500
                )
              );
            }
          } catch (error) {
            return next(
              new ApiError(
                `Error deleting image from Cloudinary: ${
                  error.message || JSON.stringify(error)
                }`,
                500
              )
            );
          }
        })
      );
    }

    next();
  });

// دالة تعديل صور المنتج
exports.updateProductImages = (model, modelName, folderName) =>
  asyncHandler(async (req, res, next) => {
    // 1- البحث عن الوثيقة بناءً على المعرف
    const document = await model.findById(req.params.id);

    if (!document) {
      return next(
        new ApiError(
          `No ${modelName} found with this ID: ${req.params.id}`,
          404
        )
      );
    }

    // 2- تعريف دالة getPublicId لاستخراج public_id من رابط الصورة
    const getPublicId = (imageUrl) => {
      const parts = imageUrl.split("/");
      const lastPart = parts.pop();
      const publicId = lastPart.split(".")[0];
      return `Tandn-shop/${folderName}/${publicId}`;
    };

    // 3- حذف صورة الغلاف القديمة (imageCover) إذا كانت موجودة
    if (document.imageCover && req.files.imageCover) {
      const imageCoverUrl = document.imageCover;
      const publicId = getPublicId(imageCoverUrl);

      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result !== "ok") {
            return next(
              new ApiError(
                `Failed to delete imageCover from Cloudinary: ${JSON.stringify(
                  result
                )}`,
                500
              )
            );
          }
        } catch (error) {
          return next(
            new ApiError(
              `Error deleting imageCover from Cloudinary: ${error.message}`,
              500
            )
          );
        }
      }
    }

    // 4- حذف جميع الصور القديمة من مصفوفة images إذا كانت موجودة
    if (document.images && document.images.length > 0 && req.files.images) {
      await Promise.all(
        document.images.map(async (imageUrl) => {
          const publicId = getPublicId(imageUrl);
          if (publicId) {
            try {
              const result = await cloudinary.uploader.destroy(publicId);
              if (result.result !== "ok") {
                return next(
                  new ApiError(
                    `Failed to delete image from Cloudinary: ${JSON.stringify(
                      result
                    )}`,
                    500
                  )
                );
              }
            } catch (error) {
              return next(
                new ApiError(
                  `Error deleting image from Cloudinary: ${error.message}`,
                  500
                )
              );
            }
          }
        })
      );
    }

    // 5- معالجة ورفع صورة الغلاف الجديدة إذا كانت موجودة
    if (req.files.imageCover && req.files.imageCover[0].buffer) {
      const imageCoverFileName = `${modelName}-${uuidv4()}-${Date.now()}-cover.png`;
      const publicIdCover = imageCoverFileName.split(".")[0];

      try {
        const processedImageCoverBuffer = await sharp(
          req.files.imageCover[0].buffer
        )
          .resize(2000, 1333)
          .toFormat("png")
          .png({ quality: 95 })
          .toBuffer();

        const cloudinaryResponseCover = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: publicIdCover,
              folder: `Tandn-shop/${folderName}`,
            },
            (error, result) => {
              if (error) {
                reject(new Error("Error uploading imageCover to Cloudinary"));
              } else {
                resolve(result);
              }
            }
          );
          stream.end(processedImageCoverBuffer);
        });

        // تحديث رابط صورة الغلاف في المستند
        document.imageCover = cloudinaryResponseCover.secure_url;
      } catch (error) {
        return next(
          new ApiError("Error processing or uploading imageCover", 500)
        );
      }
    }

    // 6- معالجة ورفع الصور الجديدة في مصفوفة images إذا كانت موجودة
    if (req.files.images) {
      document.images = [];

      await Promise.all(
        req.files.images.map(async (img, index) => {
          if (img.buffer) {
            const imageName = `${modelName}-${uuidv4()}-${Date.now()}-${
              index + 1
            }.png`;
            const publicIdImage = imageName.split(".")[0];

            try {
              const processedImageBuffer = await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat("png")
                .png({ quality: 95 })
                .toBuffer();

              const cloudinaryResponseImage = await new Promise(
                (resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                    {
                      public_id: publicIdImage,
                      folder: `Tandn-shop/${folderName}`,
                    },
                    (error, result) => {
                      if (error) {
                        reject(
                          new Error(
                            `Error uploading image ${index + 1} to Cloudinary`
                          )
                        );
                      } else {
                        resolve(result);
                      }
                    }
                  );
                  stream.end(processedImageBuffer);
                }
              );

              // تحديث رابط الصورة في المستند
              document.images.push(cloudinaryResponseImage.secure_url);
            } catch (error) {
              return next(
                new ApiError(
                  `Error processing or uploading image ${index + 1}`,
                  500
                )
              );
            }
          }
        })
      );
    }

    // 7- حفظ المستند المحدث في قاعدة البيانات
    await document.save();

    next();
  });
