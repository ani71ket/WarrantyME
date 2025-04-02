export const saveToMongoDB = async (content) => {
  try {
    const response = await fetch("https://your-mongodb-api.com/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error("Failed to save to MongoDB");
    return true;
  } catch (error) {
    console.error("❌ MongoDB Save Failed:", error.message);
    return false;
  }
};
