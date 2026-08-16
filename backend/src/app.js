const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const resumeVersionRoutes = require("./routes/resume-version.routes");
const aiRoutes = require("./routes/ai.routes");
const latexRoutes = require("./routes/latex.routes");
const errorHandler = require("./middleware/error.middleware");
const authenticate = require("./middleware/auth.middleware");
const resumeRepository = require("./repositories/resume.repository");
const {initializeSocket,} = require("./socket/socket");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initializeSocket(io);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
 

  socket.on("resume:join", async (resumeId) => {
    try {
      if (!resumeId) {
        return socket.emit("resume:error", {
          message: "Resume ID is required",
        });
      }

      const resume = await resumeRepository.findResumeById(
        resumeId,
        socket.user.userId,
      );

      if (!resume) {
        return socket.emit("resume:error", {
          message: "Resume not found or unauthorized",
        });
      }

      const room = `resume:${resumeId}`;

      socket.join(room);

      

      socket.emit("resume:joined", {
        resumeId,
        room,
      });
    } catch (error) {
      console.error("Resume room join error:", error);

      socket.emit("resume:error", {
        message: "Unable to join resume room",
      });
    }
  });

 socket.on("resume:leave", (resumeId) => {
  if (!resumeId) {
    return socket.emit("resume:error", {
      message: "Resume ID is required",
    });
  }

  const room = `resume:${resumeId}`;

  socket.leave(room);

  console.log(
    `Socket ${socket.id} left room ${room}`,
  );

  socket.emit("resume:left", {
    resumeId,
    room,
  });
});

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "ResumeForge backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", resumeVersionRoutes);
app.use("/api/latex", latexRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    userId: req.user.userId,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = {
  app,
  server,
};
