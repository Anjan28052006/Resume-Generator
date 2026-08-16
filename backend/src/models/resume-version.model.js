const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    versionNumber: {
      type: Number,
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    createdBy: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resumeVersionSchema.index(
  { resumeId: 1, versionNumber: 1 },
  { unique: true }
);

const ResumeVersion = mongoose.model(
  "ResumeVersion",
  resumeVersionSchema
);

module.exports = ResumeVersion;