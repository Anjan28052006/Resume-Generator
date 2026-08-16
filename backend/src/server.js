require("dotenv").config();

const { server } = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, "0.0.0.0",() => {
    console.log(
      `ResumeForge server running on http://localhost:${PORT}`,
    );
  });
};

startServer();