const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = async (req, res) => {
  try {
    const file = req.file; // Uploaded file information

    // Generate a unique filename (optional)
    const newFilename = `${Date.now()}-${file.originalname}`;

    // Upload to S3 bucket
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: newFilename,
      Body: fs.readFileSync(file.path), // Read file from temporary storage
    };

    const uploadResult = await s3.upload(params).promise();

    // Respond with success message and S3 object URL
    res.json({
      message: "File uploaded successfully!",
      ...uploadResult,
    });
    fs.unlinkSync(file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file!" });
  }
};

const fetchFile = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: req.body.key,
    };

    const data = await s3.getObject(params).promise();
    res.success(data.Body);
  } catch (error) {
    console.error(error);
    res.fail(error.message);
  }
};

const deleteFile = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: req.body.key,
    };

    const data = await s3.deleteObject(params).promise();
    res.success(data.Body);
  } catch (error) {
    console.error(error);
    res.fail(error.message);
  }
};

module.exports = {
  uploadFile,
  fetchFile,
  deleteFile,
};
