const fs = require("fs/promises");

const getFile = async (storageKey) => {
  return storageKey;
};

const deleteFile = async (storageKey) => {
  try {
    await fs.unlink(storageKey);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  getFile,
  deleteFile,
};