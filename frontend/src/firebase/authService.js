import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "consent" });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken(true);
    console.log("User:", user);
    console.log("Access Token:", token);

    return { user, token };
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
