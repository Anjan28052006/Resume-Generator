const fs = require("fs/promises");

const cleanupTempDir = async (tempDir) => {
  if (!tempDir) {
    return;
  }

  try {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });

    console.log("Temporary directory cleaned:", tempDir);
  } catch (error) {
    console.error(
      "Failed to clean temporary directory:",
      tempDir,
      error.message,
    );
  }
};

module.exports = {
  cleanupTempDir,
};