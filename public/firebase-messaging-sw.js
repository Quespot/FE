importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyD1DAdlqzDcTWzBaLK220l7CCO7SdXN6YU",
  authDomain: "quespot-655f3.firebaseapp.com",
  projectId: "quespot-655f3",
  storageBucket: "quespot-655f3.firebasestorage.app",
  messagingSenderId: "686318748064",
  appId: "1:686318748064:web:e7a94717ce0cd715e5e4c5",
});

firebase.messaging();
