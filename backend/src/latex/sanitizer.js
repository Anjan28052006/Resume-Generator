const MAX_LATEX_SIZE = 200 * 1024; // 200 KB

const dangerousPatterns = [
  /\\write18\b/i,
  /\\immediate\s*\\write18\b/i,
  /--shell-escape/i,
  /-shell-escape/i,
  /\\input\s*\{\s*\//i,
  /\\include\s*\{\s*\//i,
  /\\input\s*\{\s*\.\./i,
  /\\include\s*\{\s*\.\./i,
];

const validate = (latex) => {
  if (!latex || typeof latex !== "string") {
    throw new Error("LaTeX must be a non-empty string");
  }

  if (Buffer.byteLength(latex, "utf8") > MAX_LATEX_SIZE) {
    throw new Error("LaTeX document is too large");
  }

  for (const pattern of dangerousPatterns) {
    if (pattern.test(latex)) {
      throw new Error("LaTeX contains a potentially dangerous command");
    }
  }

  return true;
};

module.exports = {
  validate,
};