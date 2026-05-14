// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAyVpu_pdHkwqETOcj5ePZYAUNAoU0IvqQ",
    authDomain: "computer-science-webstie.firebaseapp.com",
    databaseURL: "https://computer-science-webstie-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "computer-science-webstie",
    storageBucket: "computer-science-webstie.firebasestorage.app",
    messagingSenderId: "775591822351",
    appId: "1:775591822351:web:dc928bb5fa692592cd8f7a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, ref };
