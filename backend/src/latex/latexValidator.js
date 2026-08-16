const validateLatex = (latex) => {
  if (typeof latex !== "string") {
    throw new Error("LaTeX must be a string");
  }

  if (!latex.trim()) {
    throw new Error("LaTeX content cannot be empty");
  }

  if (latex.length > 100000) {
    throw new Error("LaTeX content is too large");
  }

  return true;
};

module.exports = {
  validateLatex,
};