const express = require("express");

const resumeController = require("../controllers/resume.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.post("/", resumeController.createResume);
router.get("/", resumeController.getUserResumes);
router.get("/:id", resumeController.getResume);
router.put("/:id", resumeController.updateResume);
router.delete("/:id", resumeController.deleteResume);
router.post("/:id/compile", resumeController.compileResume);
router.get("/:id/pdf", resumeController.getResumePdf);
router.get("/:id/files", resumeController.getResumeFiles);
router.get("/:id/files/:fileId",resumeController.getResumeFile);
router.get("/:id/files/:fileId/download", resumeController.downloadResumeFile);
router.get("/:id/latex",resumeController.getResumeLatex);
router.put("/:id/latex",resumeController.updateResumeLatex);
router.post("/:id/compile-saved",resumeController.compileSavedLatex);
router.post("/:id/generate-and-compile",resumeController.generateAndCompileResume);


module.exports = router;