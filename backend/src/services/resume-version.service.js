const resumeRepository = require("../repositories/resume.repository");
const resumeVersionRepository = require("../repositories/resume-version.repository");

const restoreVersion = async (
  resumeId,
  userId,
  versionNumber
) => {
  const resume = await resumeRepository.findResumeById(
    resumeId,
    userId
  );

  if (!resume) {
    throw new Error("Resume not found");
  }

  const version = await resumeVersionRepository.findVersion(
    resumeId,
    Number(versionNumber)
  );

  if (!version) {
    throw new Error("Resume version not found");
  }

  // Save the current state before restoring the old one.
  await resumeVersionRepository.createVersion({
    resumeId: resume._id,
    versionNumber: resume.currentVersion,
    content: resume.content,
    createdBy: "user",
  });

  const restoredResume = await resumeRepository.updateResume(
    resumeId,
    userId,
    {
      content: version.content,
      currentVersion: resume.currentVersion + 1,
    }
  );

  return restoredResume;
};

module.exports = {
  restoreVersion,
};