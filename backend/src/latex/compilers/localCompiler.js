const { execFile } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");

const compile = async (latex) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resumeforge-"));

  const texPath = path.join(tempDir, "resume.tex");

  try {
    await fs.writeFile(texPath, latex, "utf8");


    await new Promise((resolve, reject) => {
      execFile(
        "tectonic",
        ["--outdir", tempDir, "--keep-logs", texPath],
        {
          timeout: 120000,
          maxBuffer: 1024 * 1024,
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(
              new Error(
                [
                  "LaTeX compilation failed",
                  `Exit code: ${error.code}`,
                  `STDOUT:\n${stdout}`,
                  `STDERR:\n${stderr}`,
                  `Message: ${error.message}`,
                ].join("\n\n"),
              ),
            );
            return;
          }

          resolve();
        },
      );
    });

    const pdfPath = path.join(tempDir, "resume.pdf");

    await fs.access(pdfPath);

    return {
      pdfPath,
      tempDir,
    };
  } catch (error) {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });

    throw error;
  }
};

module.exports = {
  compile,
};
