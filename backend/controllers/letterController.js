import Letter from "../models/letterModel.js";

export const saveLetter = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        // ✅ Remove user dependency & save letter directly
        const newLetter = new Letter({ content });
        await newLetter.save();

        console.log("✅ Letter stored in MongoDB");
        res.status(201).json({ message: "Letter saved successfully" });
    } catch (error) {
        console.error("❌ MongoDB Save Error:", error);
        res.status(500).json({ error: "Failed to save letter" });
    }
};

// ✅ Fetch all saved letters
export const getLetters = async (req, res) => {
    try {
        const letters = await Letter.find();  // Fetch all letters
        res.status(200).json(letters);
    } catch (error) {
        console.error("❌ Error fetching letters:", error);
        res.status(500).json({ error: "Failed to fetch letters" });
    }
};

// Delete a Letter
export const deleteLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLetter = await Letter.findByIdAndDelete(id);

    if (!deletedLetter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    res.status(200).json({ message: "Letter deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting letter:", error);
    res.status(500).json({ error: "Failed to delete letter" });
  }
};

