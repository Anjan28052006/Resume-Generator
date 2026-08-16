const crypto = require("crypto");

const hashLatex = (latex) => {
  return crypto
    .createHash("sha256")
    .update(latex, "utf8")
    .digest("hex");
};

module.exports = {
  hashLatex,
};