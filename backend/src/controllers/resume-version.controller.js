const resumeRepository = require("../repositories/resume.repository");
const resumeVersionRepository = require("../repositories/resume-version.repository");
const resumeVersionService = require("../services/resume-version.service");

const getVersions = async (req, res, next) => {
  try {
    const { id: resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await resumeRepository.findResumeById(
      resumeId,
      userId
    );

    if (!resume) {
      throw new Error("Resume not found");
    }

    const versions =
      await resumeVersionRepository.findVersionsByResumeId(
        resumeId
      );

    res.status(200).json({
      success: true,
      data: {
        versions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const restoreVersion = async (req, res, next) => {
  try {
    const { id: resumeId, versionNumber } = req.params;

    const resume = await resumeVersionService.restoreVersion(
      resumeId,
      req.user.userId,
      versionNumber
    );

    res.status(200).json({
      success: true,
      data: {
        resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVersions,
  restoreVersion,
};