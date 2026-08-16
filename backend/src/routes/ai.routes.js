const express = require("express");

const aiController = require("../controllers/ai.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/summary", aiController.generateSummary);

router.post(
  "/resumes/:id/summary",
  aiController.generateResumeSummary
);

router.post(
  "/resumes/:id/improve",
  aiController.improveText
);

module.exports = router;