const express = require("express");

const resumeVersionController = require(
  "../controllers/resume-version.controller"
);

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
  "/resumes/:id/versions",
  resumeVersionController.getVersions
);

router.post(
  "/resumes/:id/versions/:versionNumber/restore",
  resumeVersionController.restoreVersion
);

module.exports = router;