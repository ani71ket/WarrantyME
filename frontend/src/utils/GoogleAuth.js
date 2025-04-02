import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "159182037520-2o2og6o020lflqo8j7mie8f8ml81f2q7.apps.googleusercontent.com";
const API_KEY = "AIzaSyBONN9nc3rw0reAq1Nj1ScjlVqwxcycLpo";
const SCOPES = ["https://www.googleapis.com/auth/drive.appdata", "https://www.googleapis.com/auth/drive.file"];

export const initGoogleAuth = () => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      redirectUri: window.location.origin + "/auth", // Redirect to your frontend
    });
  });
}

export const initGoogleDrive = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: "AIzaSyDQRg2FLntvHmuNSsQxBkXQrGYLuflltkQ",
        clientId: "159182037520-2o2og6o020lflqo8j7mie8f8ml81f2q7.apps.googleusercontent.com",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/drive.file",
      })
      .then(() => {
        console.log("Google API initialized");
      })
      .catch((error) => {
        console.error("Error initializing Google API", error);
      });
  });
};


export const signInWithGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  const user = await authInstance.signIn({
    prompt: "consent",
    ux_mode: "redirect",  // Forces redirect instead of popup
    redirect_uri: window.location.origin + "/auth",
  });

  return user.getAuthResponse().access_token;
};


export const signOutGoogle = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  authInstance.signOut();
};
