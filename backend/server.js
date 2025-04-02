import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import letterRoutes from "./routes/letterRoutes.js";
import Letter from "./models/letterModel.js"; // ✅ Added missing import

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/letters", letterRoutes);

// ✅ Save letter directly to MongoDB (No Authorization Required)
app.post("/api/letters/save", async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const newLetter = new Letter({ content });
        await newLetter.save();

        console.log("✅ Letter stored in MongoDB");
        res.status(201).json({ message: "Letter saved successfully" });
    } catch (error) {
        console.error("❌ MongoDB Save Error:", error);
        res.status(500).json({ error: "Failed to save letter" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
