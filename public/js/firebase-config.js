import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOkWJWaDZCfEq2jPy11qL3vBaf32k4Uj8",
    authDomain: "agriswap-cb307.firebaseapp.com",
    projectId: "agriswap-cb307",
    storageBucket: "agriswap-cb307.firebasestorage.app",
    messagingSenderId: "976583398186",
    appId: "1:976583398186:web:078c07d8c8c8dc5e35c453"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Expose to global window object for easy access in our app
window.FirebaseAuth = auth;
window.FirebaseGoogleProvider = googleProvider;
window.FirebaseSignInWithPopup = signInWithPopup;
window.FirebaseSignOut = signOut;
window.FirebaseOnAuthStateChanged = onAuthStateChanged;
