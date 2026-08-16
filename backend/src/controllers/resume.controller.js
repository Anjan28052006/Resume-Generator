const resumeService = require("../services/resume.service");
const latexService = require("../services/latex.service");
const generatedFileService = require("../services/generatedFile.service");
const latexHasher = require("../latex/hasher");
const fileStorageService = require("../services/fileStorage.service");
const axios = require("axios");
const { getIO } = require("../socket/socket");

const createResume = async (req, res, next) => {
  try {
    const resume = await resumeService.createResume(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      data: {
        resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserResumes = async (req, res, next) => {
  try {
    const resumes = await resumeService.getUserResumes(req.user.userId);

    res.status(200).json({
      success: true,
      data: {
        resumes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getResume(
      req.params.id,
      req.user.userId,
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

const updateResume = async (req, res, next) => {
  try {
    const resume = await resumeService.updateResume(
      req.params.id,
      req.user.userId,
      req.body,
    );

    const io = getIO();

    io.to(`resume:${req.params.id}`).emit("resume:updated", {
      resumeId: req.params.id,
      resume,
    });

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

const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const compileResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { latex } = req.body;

    const result = await resumeService.compileResume(
      id,
      req.user.userId,
      latex,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      reused: result.reused,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getResumePdf = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await resumeService.getResume(id, req.user.userId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeOwner = await resumeService.verifyResumeOwnership(
      id,
      req.user.userId,
    );

    const generatedFile = await generatedFileService.getLatestGeneratedFile(id);

    if (!generatedFile) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    return res.redirect(generatedFile.url);
  } catch (error) {
    next(error);
  }
};

const getResumeFiles = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resume = await resumeService.getResume(id, req.user.userId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeOwner = await resumeService.verifyResumeOwnership(
      id,
      req.user.userId,
    );
    if (!resumeOwner) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const files = await generatedFileService.getGeneratedFiles(id);

    res.status(200).json({
      success: true,
      data: {
        files,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getResumeFile = async (req, res, next) => {
  try {
    const { id, fileId } = req.params;

    const resume = await resumeService.getResume(id, req.user.userId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeOwner = await resumeService.verifyResumeOwnership(
      id,
      req.user.userId,
    );
    if (!resumeOwner) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const generatedFile = await generatedFileService.getGeneratedFile(
      id,
      fileId,
    );

    if (!generatedFile) {
      return res.status(404).json({
        success: false,
        message: "Generated file not found",
      });
    }
    return res.redirect(generatedFile.url);
  } catch (error) {
    next(error);
  }
};

const downloadResumeFile = async (req, res, next) => {
  try {
    const { id, fileId } = req.params;

    const resume = await resumeService.getResume(
      id,
      req.user.userId,
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeOwner = await resumeService.verifyResumeOwnership(
      id,
      req.user.userId,
    );

    if (!resumeOwner) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const generatedFile =
      await generatedFileService.getGeneratedFile(
        id,
        fileId,
      );

    if (!generatedFile) {
      return res.status(404).json({
        success: false,
        message: "Generated file not found",
      });
    }

    const response = await axios.get(generatedFile.url, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${id}.pdf"`,
    );

    response.data.pipe(res);
  } catch (error) {
    next(error);
  }
};

const getResumeLatex = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resumeService.getResumeLatex(
      id,
      req.user.userId,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateResumeLatex = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { latex } = req.body;

    if (typeof latex !== "string") {
      return res.status(400).json({
        success: false,
        message: "latex must be a string",
      });
    }

    const result = await resumeService.updateResumeLatex(
      id,
      req.user.userId,
      latex,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const io = getIO();

    io.to(`resume:${id}`).emit("resume:latex-updated", { //change
      resumeId: id,
      ...result,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const compileSavedLatex = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resumeService.compileSavedLatex(
      id,
      req.user.userId,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (result.noLatex) {
      return res.status(400).json({
        success: false,
        message: "No LaTeX content saved for this resume",
      });
    }

    res.status(200).json({
      success: true,
      reused: result.reused,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generateAndCompileResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resumeService.generateAndCompileResume(
      id,
      req.user.userId,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const compileSavedResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resumeService.compileSavedResume(
      id,
      req.user.userId,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResume,
  getUserResumes,
  getResume,
  updateResume,
  deleteResume,
  compileResume,
  getResumePdf,
  getResumeFiles,
  getResumeFile,
  downloadResumeFile,
  getResumeLatex,
  updateResumeLatex,
  compileSavedLatex,
  generateAndCompileResume,
  compileSavedResume,
};
