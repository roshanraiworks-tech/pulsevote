import express from "express";
import cors from "cors";
import pollRoutes from "./routes/pollRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PulseVote backend is running",
    });
});

app.use("/api/polls", pollRoutes);

export default app;