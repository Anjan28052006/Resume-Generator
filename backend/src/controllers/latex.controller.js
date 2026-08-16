const latexService = require("../services/latex.service");

const generateLatex = async (req, res, next) => {
  try {
    const result = await latexService.generateLatex(
      req.params.id,
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const compileLatex = async (req, res, next) => {
  try {
    const { latex } = req.body;

    const result = await latexService.compileLatex(latex);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateLatex,
  compileLatex,
};