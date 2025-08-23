// routes/uploadRoutes.js
const express = require("express");
const uploadRouter = express.Router();
const upload = require("../middleware/multer.js");
const { uploadImage } = require("../controllers/uploadController.js");

uploadRouter.post("/fileUpload", upload.single("image"), uploadImage);

module.exports = uploadRouter;
