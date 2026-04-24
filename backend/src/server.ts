import express from "express";
import cors from "cors";
import bfhlRouter from "./routes/bfhl";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// ─── Routes ───
app.use("/bfhl", bfhlRouter);

// ─── Health check ───
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "BFHL API is running",
    endpoint: "POST /bfhl",
  });
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`🚀 BFHL API server running on port ${PORT}`);
});

export default app;
