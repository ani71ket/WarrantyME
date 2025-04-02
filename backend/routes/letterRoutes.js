import express from "express";
import { saveLetter, getLetters, deleteLetter } from "../controllers/letterController.js";

const router = express.Router();

// Save letter to MongoDB (No authentication required)
router.post("/save", saveLetter);

// Fetch all saved letters (No authentication required)
router.get("/all", getLetters);

// Delete a letter from MongoDB (No authentication required)
router.delete("/delete/:id", deleteLetter);

export default router;
