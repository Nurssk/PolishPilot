import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth/web-extension";

// Firebase web config is public by design — safe to ship in client code.
// Do NOT add service-account keys or admin secrets to the extension.
export const firebaseConfig = {
  apiKey: "AIzaSyCaWik40y-a2Q_RaYYduMDh-Se0ZpKCRdo",
  authDomain: "humanize-ui.firebaseapp.com",
  projectId: "humanize-ui",
  storageBucket: "humanize-ui.firebasestorage.app",
  messagingSenderId: "770696481931",
  appId: "1:770696481931:web:74ca13ac394aa8f634588e",
  measurementId: "G-0ZXYGDJB5Y"
};

// Singleton init — avoids "Firebase App named '[DEFAULT]' already exists".
export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// `firebase/auth/web-extension` provides an Auth instance that works in the
// MV3 service-worker / side-panel context without an offscreen document.
export const firebaseAuth: Auth = getAuth(firebaseApp);
