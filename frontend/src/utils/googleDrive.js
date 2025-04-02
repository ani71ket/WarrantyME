import { gapi } from "gapi-script";
import { saveToMongoDB } from "./mongoService"; // Import MongoDB save function


export const getAccessToken = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  return authInstance.currentUser.get().getAuthResponse().access_token;
};

export async function saveToGoogleDrive(content) {
  try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbxDTX4snWLAWGs2LvaYiMzwzcyLgH9Me0ZQxJcsZqoQe0-e4BCgJBcyu1xl-zquHGJcpw/exec"; 

      const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!data.success) {
          throw new Error(data.error || "Google Drive Save Failed");
      }

      console.log("✅ Letter saved:", data);
      return true;
  } catch (error) {
      console.error("❌ Google Drive Save Error:", error.message);
      return false;
  }
}

export const fetchLettersFromDrive = async () => {
  try {
    console.log("ℹ️ Fetching saved letters from Google Drive...");

    const folderId = "1Bmq6DwMFuI7DTjRAxdenm5LgqRXc-cY5"; // Replace with your Google Drive Folder ID
    const apiKey = "AIzaSyBONN9nc3rw0reAq1Nj1ScjlVqwxcycLpo"; // Replace with your Google API Key

    if (!folderId || !apiKey) {
        throw new Error("❌ Missing API Key or Folder ID. Check your configuration.");
    }

    // Step 1: List all files in the folder
    const listResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}`
    );

    const listData = await listResponse.json();
    if (!listResponse.ok) {
        throw new Error(`Google Drive List Error: ${listData.error?.message || listResponse.statusText}`);
    }

    const files = listData.files || [];
    console.log("📂 Retrieved Files:", files);

    if (files.length === 0) {
        return [];
    }

    // Step 2: Fetch the content of each file
    const letters = await Promise.all(
        files.map(async (file) => {
            const fileResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${apiKey}`
            );

            const content = await fileResponse.text();
            return { id: file.id, name: file.name, content };
        })
    );

    console.log("📄 Saved Letters:", letters);
    return letters;
} catch (error) {
    console.error("❌ Google Drive Fetch Error:", error.message);
    return [];
}
}

export const deleteLetterFromDrive = async (letterName, accessToken) => {
  console.log("Attempting to delete letter:", letterName);

  try {
    // Step 1: Get file ID from Google Drive
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(letterName)}'`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Failed to search for letter: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    console.log("Drive API search response:", searchData);

    if (!searchData.files || searchData.files.length === 0) {
      throw new Error("Letter not found in Google Drive.");
    }

    const fileId = searchData.files[0].id;

    // Step 2: Delete the file
    const deleteResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete letter: ${deleteResponse.statusText}`);
    }

    console.log("Letter deleted successfully from Google Drive.");
    return true;
  } catch (error) {
    console.error("Error deleting letter from Google Drive:", error);
    return false;
  }
};

