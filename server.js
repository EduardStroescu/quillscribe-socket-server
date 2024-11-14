import express from "express";
import http from "http";
import cors from "cors";
import { Server as ServerIO } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const apiRouter = express.Router();
const io = new ServerIO(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_URL,
  },
});

// CORS for HTTP requests
app.use(cors({ origin: process.env.NEXT_PUBLIC_URL }));

apiRouter.get("/", (_req, res) => {
  res.status(200).send("API endpoint working!");
});

io.on("connection", (socket) => {
  socket.on("create-room", (fileId) => {
    console.log(fileId);
    socket.join(fileId);
  });
  socket.on("send-changes", (deltas, fileId) => {
    socket.to(fileId).emit("receive-changes", deltas, fileId);
  });
  socket.on("send-cursor-move", (range, fileId, cursorId) => {
    socket.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
  });
});

app.use("/api", apiRouter);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
