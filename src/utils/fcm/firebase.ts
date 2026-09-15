import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD1DAdlqzDcTWzBaLK220l7CCO7SdXN6YU",
  authDomain: "quespot-655f3.firebaseapp.com",
  projectId: "quespot-655f3",
  storageBucket: "quespot-655f3.firebasestorage.app",
  messagingSenderId: "686318748064",
  appId: "1:686318748064:web:e7a94717ce0cd715e5e4c5",
  measurementId: "G-V0HPDTXN4E",
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const FIREBASE_VAPID_KEY =
  "BOmMCNOvn69eFNAgA8_9F8gAJ2x38PKM5Im9c0NF1pCPZLfPT5eFwlE_4Bdlb9CTf8eXjIwd5OmAu9yQble-9Tg";
