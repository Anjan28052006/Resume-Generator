const resumeRepository = require("../repositories/resume.repository");
const resumeVersionRepository = require("../repositories/resume-version.repository");
const geminiService = require("./gemini.service");

const generateResumeSummary = async (resumeId, userId) => {
  const resume = await resumeRepository.findResumeById(
    resumeId,
    userId
  );

  if (!resume) {
    throw new Error("Resume not found");
  }

  const prompt = `
You are an expert professional resume writer.

Generate a professional resume summary based ONLY on the information
provided below.

Resume data:
${JSON.stringify(resume.content, null, 2)}

Requirements:
- Write 3 to 4 concise sentences.
- Use professional resume language.
- Do not invent qualifications, experience, skills, or achievements.
- Highlight the candidate's strongest relevant qualities.
- Do not include a heading.
`;

  const summary = await geminiService.generateText(prompt);

  await resumeVersionRepository.createVersion({
    resumeId: resume._id,
    versionNumber: resume.currentVersion,
    content: resume.content,
    createdBy: "ai",
  });

  const updatedContent = {
    ...resume.content,
    personal: {
      ...(resume.content.personal || {}),
      summary: summary.trim(),
    },
  };

  return await resumeRepository.updateResume(
    resumeId,
    userId,
    {
      content: updatedContent,
      currentVersion: resume.currentVersion + 1,
    }
  );
};

const improveText = async (resumeId, userId, text, section) => {
  const resume = await resumeRepository.findResumeById(
    resumeId,
    userId
  );

  if (!resume) {
    throw new Error("Resume not found");
  }

  if (!text || !text.trim()) {
    throw new Error("Text is required");
  }

  const prompt = `
You are an expert professional resume writer.

Improve the following resume content.

Section:
${section || "General resume content"}

Original text:
${text}

Requirements:
- Make the writing professional and concise.
- Use strong action-oriented language.
- Preserve the original meaning.
- Do not invent facts, numbers, achievements, technologies, or experience.
- Return ONLY the improved text.
`;

  const improvedText = await geminiService.generateText(prompt);

  return {
    originalText: text,
    improvedText: improvedText.trim(),
  };
};

module.exports = {
  generateResumeSummary,
  improveText,
};