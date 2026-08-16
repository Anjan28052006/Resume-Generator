const localCompiler = require("./compilers/localCompiler");

const compileLatex = async (latex) => {
  return localCompiler.compile(latex);
};

module.exports = {
  compileLatex,
};