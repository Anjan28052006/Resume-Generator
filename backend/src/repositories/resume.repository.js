const Resume = require("../models/resume.model");

const createResume = async (resumeData) => {
  const resume = await Resume.create(resumeData);

  return resume;
};

const findResumesByUserId = async (userId) => {
  const resumes = await Resume.find({ userId })
    .sort({ updatedAt: -1 });

  return resumes;
};

const findResumeById = async (resumeId, userId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  });

  return resume;
};

const updateResume = async (resumeId, userId, updateData) => {
  const resume = await Resume.findOneAndUpdate(
    {
      _id: resumeId,
      userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
    { returnDocument: 'after' }
  );

  return resume;
};

const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findOneAndDelete({
    _id: resumeId,
    userId,
  });

  return resume;
};

module.exports = {
  createResume,
  findResumesByUserId,
  findResumeById,
  updateResume,
  deleteResume,
};