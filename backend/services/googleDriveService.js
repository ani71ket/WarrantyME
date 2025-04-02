import { google } from "googleapis";
import fs from "fs";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const uploadToGoogleDrive = async (title, content) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const fileMetadata = { name: `${title}.txt`, mimeType: "text/plain" };
  const media = { mimeType: "text/plain", body: content };

  const response = await drive.files.create({ resource: fileMetadata, media });
  return response.data.id;
};
