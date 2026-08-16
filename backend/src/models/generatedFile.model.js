const mongoose = require("mongoose");

const generatedFileSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["pdf"],
      required: true,
    },

    storageKey: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      default: null,
    },

    latexHash: {
      type: String,
      required: true,
    },
    isLatest: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("GeneratedFile", generatedFileSchema);
