// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);

const logFirebaseEvent = (type: any, additionalParams: any) => {
  if (analytics) {
    logEvent(analytics, type, additionalParams);
  }
};

export { app, auth, logFirebaseEvent, db, storage };
