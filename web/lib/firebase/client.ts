import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaWik40y-a2Q_RaYYduMDh-Se0ZpKCRdo",
  authDomain: "humanize-ui.firebaseapp.com",
  projectId: "humanize-ui",
  storageBucket: "humanize-ui.firebasestorage.app",
  messagingSenderId: "770696481931",
  appId: "1:770696481931:web:74ca13ac394aa8f634588e",
  measurementId: "G-0ZXYGDJB5Y"
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);

let analyticsPromise: Promise<Analytics | null> | null = null;

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  analyticsPromise ??= isSupported()
    .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    .catch(() => null);

  return analyticsPromise;
}
