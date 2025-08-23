
const cloudinary = require("../config/cloudinary");
const fs = require('fs');
const { promisify } = require('util');
const path = require("path")
const unlinkAsync = promisify(fs.unlink);

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const filePath = path.resolve(req.file.path)

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "my_app_uploads",
            resource_type: "image",
        });

        await unlinkAsync(filePath);
        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
