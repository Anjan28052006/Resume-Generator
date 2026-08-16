const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    templateId: {
      type: String,
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    status: {
      type: String,
      enum: ["draft", "ready", "generating", "failed"],
      default: "draft",
    },

    currentVersion: {
      type: Number,
      default: 1,
    },
    currentLatex: {
      type: String,
      default: null,
    },

    latexHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
