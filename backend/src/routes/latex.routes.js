const express = require("express");

const latexController = require("../controllers/latex.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post(
  "/resumes/:id/generate",
  latexController.generateLatex
);

router.post(
  "/compile",
  latexController.compileLatex
);

module.exports = router;