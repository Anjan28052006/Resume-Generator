const GeneratedFile = require("../models/generatedFile.model");

const createGeneratedFile = async (data) => {
  return await GeneratedFile.create(data);
};

const getLatestGeneratedFile = async (resumeId) => {
  return await GeneratedFile.findOne({
    resumeId,
    type: "pdf",
    isLatest: true,
  });
};

const getGeneratedFiles = async (resumeId) => {
  return await GeneratedFile.find({
    resumeId,
    type: "pdf",
  }).sort({ createdAt: -1 });
};

const getGeneratedFile = async (resumeId, fileId) => {
  return await GeneratedFile.findOne({
    _id: fileId,
    resumeId,
    type: "pdf",
  });
};

const getGeneratedFileByHash = async (resumeId, latexHash) => {
  return await GeneratedFile.findOne({
    resumeId,
    type: "pdf",
    latexHash,
  }).sort({ createdAt: -1 });
};

const markPreviousFilesAsOld = async (resumeId) => {
    console.log("hit");
  return await GeneratedFile.updateMany(
    {
      resumeId,
      type: "pdf",
      isLatest: true,
    },
    {
      $set: {
        isLatest: false,
      },
    },
  );
};

const markFileAsLatest = async (fileId, resumeId) => {
  await GeneratedFile.updateMany(
    {
      resumeId,
      type: "pdf",
      isLatest: true,
    },
    {
      $set: {
        isLatest: false,
      },
    },
  );

  return await GeneratedFile.findOneAndUpdate(
    {
      _id: fileId,
      resumeId,
      type: "pdf",
    },
    {
      $set: {
        isLatest: true,
      },
    },
    {
      new: true,
    },
    { returnDocument: 'after' }
  );
};

module.exports = {
  createGeneratedFile,
  getLatestGeneratedFile,
  getGeneratedFiles,
  getGeneratedFile,
  getGeneratedFileByHash,
  markPreviousFilesAsOld,
  markFileAsLatest,
};