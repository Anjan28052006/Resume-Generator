const resumeRepository = require("../repositories/resume.repository");
const resumeVersionRepository = require("../repositories/resume-version.repository");
const latexService = require("./latex.service");
const generatedFileService = require("./generatedFile.service");
const latexHasher = require("../latex/hasher");
const cloudinaryService = require("./cloudinary.service");
const { cleanupTempDir } = require("../utils/fileCleanup");

const createResume = async (userId, resumeData) => {
  const resume = await resumeRepository.createResume({
    ...resumeData,
    userId,
  });

  return resume;
};

const getUserResumes = async (userId) => {
  return await resumeRepository.findResumesByUserId(userId);
};

const getResume = async (resumeId, userId) => {
  const resume = await resumeRepository.findResumeById(resumeId, userId);

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
};

const updateResume = async (resumeId, userId, updateData) => {
  const resume = await resumeRepository.findResumeById(resumeId, userId);

  if (!resume) {
    throw new Error("Resume not found");
  }

  await resumeVersionRepository.createVersion({
    resumeId: resume._id,
    versionNumber: resume.currentVersion,
    content: resume.content,
    createdBy: "user",
  });

  const updatedResume = await resumeRepository.updateResume(resumeId, userId, {
    ...updateData,
    currentVersion: resume.currentVersion + 1,
  });

  return updatedResume;
};

const deleteResume = async (resumeId, userId) => {
  const resume = await resumeRepository.deleteResume(resumeId, userId);

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
};

const verifyResumeOwnership = async (resumeId, userId) => {
  const resume = await getResume(resumeId, userId);

  if (!resume) {
    return null;
  }

  if (resume.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }

  return resume;
};

const compileResume = async (resumeId, userId, latex) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  const latexHash = latexHasher.hashLatex(latex);

  const existingFile = await generatedFileService.getGeneratedFileByHash(
    resumeId,
    latexHash,
  );

  if (existingFile) {
    const latestFile = await generatedFileService.markFileAsLatest(
      existingFile._id,
      resumeId,
    );

    return {
      reused: true,
      latexHash,
      generatedFile: latestFile,
    };
  }

  await generatedFileService.markPreviousFilesAsOld(resumeId);

  const result = await latexService.compileLatex(latex);
  const uploadedPdf = await cloudinaryService.uploadPdf(
    result.pdfPath,
    `resume-${resumeId}-${result.latexHash}`,
  );

  await cleanupTempDir(result.tempDir);

  const generatedFile = await generatedFileService.createGeneratedFile({
    resumeId,
    type: "pdf",
    storageKey: uploadedPdf.publicId,
    url: uploadedPdf.url,
    latexHash: result.latexHash,
    isLatest: true,
  });

  await updateResume(resumeId, userId, {
    currentLatex: latex,
    latexHash: result.latexHash,
  });

  return {
    reused: false,
    ...result,
    generatedFile,
  };
};

const getResumeLatex = async (resumeId, userId) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  return {
    currentLatex: resume.currentLatex || "",
    latexHash: resume.latexHash || null,
  };
};
const updateResumeLatex = async (resumeId, userId, latex) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  const latexHash = latexHasher.hashLatex(latex);

  const updatedResume = await resumeRepository.updateResume(
    resumeId,
    userId,
    {
      currentLatex: latex,
      latexHash,
    },
  );

  return {
    currentLatex: updatedResume.currentLatex,
    latexHash: updatedResume.latexHash,
  };
};
const compileSavedLatex = async (resumeId, userId) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  if (!resume.currentLatex) {
    return {
      noLatex: true,
    };
  }

  return await compileResume(resumeId, userId, resume.currentLatex);
};

const generateAndCompileResume = async (resumeId, userId) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  const result = await latexService.generateAndCompileLatex(resumeId, userId);
  const uploadedPdf = await cloudinaryService.uploadPdf(
    result.pdfPath,
    `resume-${resumeId}-${result.latexHash}`,
  );

  await cleanupTempDir(result.tempDir);

  await generatedFileService.markPreviousFilesAsOld(resumeId);

  const generatedFile = await generatedFileService.createGeneratedFile({
    resumeId,
    type: "pdf",
    storageKey: uploadedPdf.publicId,
    url: uploadedPdf.url,
    latexHash: result.latexHash,
    isLatest: true,
  });

  return {
    ...result,
    generatedFile,
  };
};

const compileSavedResume = async (resumeId, userId) => {
  const resume = await verifyResumeOwnership(resumeId, userId);

  if (!resume) {
    return null;
  }

  if (!resume.currentLatex) {
    const error = new Error("No saved LaTeX found");
    error.statusCode = 404;
    throw error;
  }

  return await compileResume(resumeId, userId, resume.currentLatex);
};

module.exports = {
  createResume,
  getUserResumes,
  getResume,
  updateResume,
  deleteResume,
  verifyResumeOwnership,
  compileResume,
  getResumeLatex,
  updateResumeLatex,
  compileSavedLatex,
  generateAndCompileResume,
  compileSavedResume,
};
