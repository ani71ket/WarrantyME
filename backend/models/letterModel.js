import mongoose from "mongoose";

const LetterSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Letter = mongoose.model("Letter", LetterSchema);

export default Letter;
