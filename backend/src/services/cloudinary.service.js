const cloudinary = require("../config/cloudinary");

const uploadPdf = async (filePath, publicId) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    public_id: publicId,
    folder: "resumeforge/pdfs",
    overwrite: true,
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    resourceType: result.resource_type,
  };
};

const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};

module.exports = {
  uploadPdf,
  deleteFile,
};