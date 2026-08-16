const resumeRepository = require("../repositories/resume.repository");
const geminiService = require("./gemini.service");
const latexSanitizer = require("../latex/sanitizer");
const latexHasher = require("../latex/hasher");
const latexCompilerService = require("../latex/latexCompilerService");
const { validateLatex } = require("../latex/latexValidator");

const cleanLatex = (latex) => {
  return latex
    .replace(/^```latex\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const ensureRequiredPackages = (latex) => {
  const usesColorCommand =
    /\\(?:color|textcolor|colorbox|fcolorbox)\b/.test(latex);

  const usesHyperrefColors =
    /(?:colorlinks|urlcolor|linkcolor|citecolor|filecolor|menucolor)\s*=/.test(
      latex
    );

  const usesColor = usesColorCommand || usesHyperrefColors;

  const hasColorPackage =
    /\\usepackage(?:\[[^\]]*\])?\{(?:xcolor|color)\}/.test(latex);

  if (usesColor && !hasColorPackage) {
    return latex.replace(
      /\\documentclass(?:\[[^\]]*\])?\{[^}]+\}/,
      (match) => `${match}\n\\usepackage{xcolor}`
    );
  }

  return latex;
};
const generateLatex = async (resumeId, userId) => {
  const resume = await resumeRepository.findResumeById(resumeId, userId);

  if (!resume) {
    throw new Error("Resume not found");
  }

  const prompt = `
You are an expert LaTeX resume generator.

Convert the structured resume data below into a professional, clean,
ATS-friendly, single-page LaTeX resume.

RESUME DATA:
${JSON.stringify(resume.content, null, 2)}

========================
STRICT LATEX RULES
========================

1. OUTPUT FORMAT

- Return ONLY the complete LaTeX source code.
- Do NOT use Markdown.
- Do NOT use code fences.
- Do NOT add explanations before or after the LaTeX.
- The first line MUST begin with:
  \\\\documentclass
- The final line MUST be:
  \\\\end{document}

2. COMPILER

The document will be compiled using XeTeX through Tectonic.

Generate LaTeX that is compatible with XeTeX and Tectonic.

3. ALLOWED PACKAGES

You may ONLY use these packages:

\\\\usepackage[letterpaper,margin=1in]{geometry}
\\\\usepackage{enumitem}
\\\\usepackage{titlesec}
\\\\usepackage{hyperref}
\\\\usepackage{xcolor}

Do NOT use any other package.

In particular, NEVER use:

- fontawesome
- fontawesome5
- tabularx
- fullpage
- fancyhdr
- multicol
- paracol
- array
- amsmath
- amssymb
- graphicx
- tikz
- ifthen
- xifthen
- inputenc
- fontenc

4. FORBIDDEN COMMANDS

NEVER use:

\\\\topmin
\\\\topmargin
\\\\oddsidemargin
\\\\evensidemargin
\\\\textwidth
\\\\textheight
\\\\addtolength
\\\\faPhone
\\\\faEnvelope

Do not perform manual page-margin manipulation.

Use the geometry package for margins.

5. CUSTOM COMMANDS

Do NOT define custom commands.

Do NOT use:

\\\\newcommand
\\\\renewcommand
\\\\def

Do NOT define custom environments.

6. PAGE STRUCTURE

Use this structure:

\\\\documentclass[10pt,letterpaper]{article}

Preamble with only the allowed packages.

\\\\pagestyle{empty}

Formatting configuration.

\\\\begin{document}

Resume content.

\\\\end{document}

7. SECTION FORMATTING

Use titlesec only for section formatting.

A safe section format is:

\\\\titleformat{\\\\section}
  {\\\\large\\\\bfseries\\\\scshape}
  {}
  {0em}
  {}
  [\\\\titlerule]

\\\\titlespacing*{\\\\section}{0pt}{8pt}{4pt}

Do not use unsupported section-formatting commands.

8. LISTS

Use enumitem only with simple valid options.

Safe examples:

\\\\begin{itemize}[leftmargin=*, itemsep=0pt, topsep=2pt]

or:

\\\\begin{itemize}[leftmargin=*, itemsep=1pt, topsep=2pt]

NEVER use:

marginparwidth

as an enumitem option.

Do not invent enumitem options.

9. HYPERLINKS

Use hyperref only for URLs and email addresses.

Example:

\\\\href{mailto:example@email.com}{example@email.com}

Do not use icon packages.

10. COLORS

Color is optional.

If color is unnecessary, do not use color commands.

If using color commands such as:

\\\\color
\\\\textcolor
\\\\colorbox

the xcolor package is already available.

Do NOT introduce another color package.

11. LATEX COMMAND SAFETY

Every LaTeX command used must either:

- be a standard LaTeX command, or
- come from one of the five explicitly allowed packages.

Never use a command from a package that has not been loaded.

Before returning the document, mentally verify that every package-specific
command has its corresponding package loaded.

12. SPECIAL CHARACTER ESCAPING

Properly escape LaTeX special characters in user content.

Escape characters such as:

&
%
$
#
_
{
}

when they appear as normal text.

Do not accidentally escape LaTeX syntax itself.

13. CONTENT ACCURACY

Preserve all factual information from the resume data.

Do NOT invent:

- companies
- jobs
- degrees
- dates
- skills
- certifications
- achievements
- URLs
- metrics
- locations

If information is missing, simply omit that field.

14. RESUME DESIGN

Create a professional ATS-friendly resume.

Use a clean hierarchy:

- Name and contact information
- Summary / Objective if provided
- Experience
- Projects
- Education
- Skills
- Certifications
- Languages
- Other relevant sections present in the data

Do not create sections that have no corresponding information.

15. RELIABILITY

Do NOT attempt to create an innovative or experimental LaTeX template.

Prefer simple, conservative LaTeX.

Do NOT introduce packages, commands, environments, icons,
custom macros, or advanced formatting merely for visual appearance.

Compilation reliability is more important than visual complexity.

16. FINAL VALIDATION

Before returning the output, verify all of the following:

- Starts with \\\\documentclass
- Contains exactly one \\\\begin{document}
- Contains exactly one \\\\end{document}
- No Markdown code fences
- No unsupported packages
- No \\\\topmin
- No \\\\addtolength
- No \\\\topmargin
- No \\\\oddsidemargin
- No \\\\textwidth manipulation
- No fontawesome commands
- No custom commands
- No custom environments
- No inputenc
- No utf8 package
- No undefined package-dependent commands
- All itemize options are valid
- All special characters in resume content are properly escaped

Return ONLY the final LaTeX document.
`;

  const response = await geminiService.generateText(prompt);

  let latex = cleanLatex(response);

  latex = ensureRequiredPackages(latex);

  validateLatex(latex);
  latexSanitizer.validate(latex);
  const latexHash = latexHasher.hashLatex(latex);
  await resumeRepository.updateResume(resumeId, userId, {
    currentLatex: latex,
    latexHash,
  });

  return {
    resumeId: resume._id,
    latex,
    latexHash,
  };
};

const compileLatex = async (latex) => {
  latexSanitizer.validate(latex);

  validateLatex(latex);
  latex = ensureRequiredPackages(latex);

  const latexHash = latexHasher.hashLatex(latex);

  const compilation = await latexCompilerService.compileLatex(latex);

  return {
    latexHash,
    pdfPath: compilation.pdfPath,
    tempDir: compilation.tempDir,
  };
};

const generateAndCompileLatex = async (resumeId, userId) => {
  const generated = await generateLatex(resumeId, userId);

  const compilation = await compileLatex(generated.latex);

  return {
    resumeId: generated.resumeId,
    latex: generated.latex,
    latexHash: compilation.latexHash,
    pdfPath: compilation.pdfPath,
    tempDir: compilation.tempDir,
  };
};


module.exports = {
  generateLatex,
  compileLatex,
  generateAndCompileLatex,
};
