// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUUj1yqmXfjY9rPPmw-vqyRhIts4i986g",
    authDomain: "computer-science-eism.firebaseapp.com",
    databaseURL: "https://computer-science-eism-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "computer-science-eism",
    storageBucket: "computer-science-eism.firebasestorage.app",
    messagingSenderId: "361142639070",
    appId: "1:361142639070:web:f9114ecc44701d0b91a54f",
    measurementId: "G-3G4062C07E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, ref };
