const asyncWrapper = require("../middlewares/async");
const {
  ExperienceLevel,
  PreparationStage,
  Companies,
} = require("../models/static");
const fs = require("fs");
const path = require("path");

const _insertDataInTable = async (fileName, tableName) => {
  const filePath = path.join(__dirname, `../stored/${fileName}.csv`);
  const csvData = [];

  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const lines = data.trim().split("\n");
    const headers = lines[0].trim().split(",");

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim().split(",");
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      csvData.push(rowData);
      await tableName.create(rowData);
    }
    // console.log("Parsed CSV data:", csvData);
  });
};

const getAllExperienceLevels = asyncWrapper(async (req, res) => {
  const data = await ExperienceLevel.findAll();
  res.success(data);
});

const postExperienceLevelsData = asyncWrapper(async (req, res) => {
  await ExperienceLevel.destroy({ where: {} });
  await _insertDataInTable("experienceLevels", ExperienceLevel);
  res.success("Data Updated");
});

const getAllPreparationStages = asyncWrapper(async (req, res) => {
  const data = await PreparationStage.findAll();
  res.success(data);
});

const postPreparationStagesData = asyncWrapper(async (req, res) => {
  await ExperienceLevel.destroy({ where: {} });
  await _insertDataInTable("experienceLevels", ExperienceLevel);
  res.success("Data Updated");
});

const getAllCompanies = asyncWrapper(async (req, res) => {
  const data = await Companies.findAll();
  res.success(data);
});

const postCompanyData = asyncWrapper(async (req, res) => {
  await Companies.destroy({ where: {} });
  await _insertDataInTable("companies", Companies);
  res.success("Data Updated");
});

const deleteCompanyData = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await Companies.destroy({
    where: {
      id,
    },
  });
  res.success("Deleted");
});

module.exports = {
  getAllExperienceLevels,
  postExperienceLevelsData,
  getAllPreparationStages,
  postPreparationStagesData,
  getAllCompanies,
  postCompanyData,
  deleteCompanyData,
};
