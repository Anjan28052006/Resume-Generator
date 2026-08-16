const geminiService = require("../services/gemini.service");
const resumeAiService = require("../services/resume-ai.service");

const generateSummary = async (req, res, next) => {
  try {
    const {
      name,
      education,
      skills,
      experience,
    } = req.body;

    const prompt = `
You are a professional resume writer.

Create a concise, professional resume summary for the following candidate.

Name: ${name || "Not provided"}
Education: ${education || "Not provided"}
Skills: ${skills?.join(", ") || "Not provided"}
Experience: ${experience || "Not provided"}

Requirements:
- Write 3 to 4 sentences.
- Use professional resume language.
- Do not invent experience or qualifications.
- Focus on skills, education, and relevant experience.
- Do not include a heading.
`;

    const summary = await geminiService.generateText(prompt);

    res.status(200).json({
      success: true,
      data: {
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
};

const generateResumeSummary = async (req, res, next) => {
  try {
    const result = await resumeAiService.generateResumeSummary(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: {
        resume: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const improveText = async (req, res, next) => {
  try {
    const { text, section } = req.body;

    const result = await resumeAiService.improveText(
      req.params.id,
      req.user.userId,
      text,
      section
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateSummary,
  generateResumeSummary,
  improveText,
};