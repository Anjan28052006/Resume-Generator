const ResumeVersion = require("../models/resume-version.model");

const createVersion = async (versionData) => {
  const version = await ResumeVersion.create(versionData);

  return version;
};

const findVersionsByResumeId = async (resumeId) => {
  const versions = await ResumeVersion.find({ resumeId })
    .sort({ versionNumber: -1 });

  return versions;
};

const findVersion = async (resumeId, versionNumber) => {
  const version = await ResumeVersion.findOne({
    resumeId,
    versionNumber,
  });

  return version;
};

module.exports = {
  createVersion,
  findVersionsByResumeId,
  findVersion,
};