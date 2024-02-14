const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const newFilename = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
    };
    const uploadResult = await s3.upload(params).promise();
    fs.unlinkSync(file.path);
    res.success(uploadResult);
  } catch (error) {
    res.fail(error.message);
  }
};

const fetchFile = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: req.params.key,
    };

    const data = await s3.getObject(params).promise();
    res.success(data.Body);
  } catch (error) {
    console.error(error);
    res.fail(error.message);
  }
};

const fetchAllFiles = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    };

    const data = await s3.listObjectsV2(params).promise();
    res.success(data.Contents);
  } catch (error) {
    console.error(error);
    res.fail(error.message);
  }
};

const deleteFile = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: req.params.key,
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
  fetchAllFiles,
  deleteFile,
};
