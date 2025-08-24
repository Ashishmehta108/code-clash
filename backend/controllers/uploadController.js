const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);

exports.uploadImage = async (req, res, next) => {
    try {
        let uploadedFiles = [];

        if (req.file) {
            const filePath = path.resolve(req.file.path);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "my_app_uploads",
                resource_type: "image",
            });

            await unlinkAsync(filePath);

            uploadedFiles.push({
                field: req.file.fieldname,
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
        console.log(uploadedFiles)

        if (req.files) {
            for (const field in req.files) {
                console.log(field)
                for (const file of req.files[field]) {
                    const filePath = path.resolve(file.path);
                    const result = await cloudinary.uploader.upload(filePath, {
                        folder: "my_app_uploads",
                        resource_type: "image",
                    });

                    await unlinkAsync(filePath);

                    uploadedFiles.push({
                        field,
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            }
        }

        req.uploadedFiles = uploadedFiles;
console.log(uploadedFiles)
        if (next) return next();

        return res.json({ success: true, files: uploadedFiles });

    } catch (error) {
        console.error(error);
        if (next) return next(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
