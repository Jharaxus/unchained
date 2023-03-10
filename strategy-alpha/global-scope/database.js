// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, set, get, update, remove, ref, child }
    from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIgimnX1ht3WHayRDc9VD844M2UcyUQZg",
    authDomain: "unchained-3aa64.firebaseapp.com",
    databaseURL: "https://unchained-3aa64-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "unchained-3aa64",
    storageBucket: "unchained-3aa64.appspot.com",
    messagingSenderId: "67060221530",
    appId: "1:67060221530:web:86c53051d341ffd717fa63"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let db = getDatabase();
export let dbget = get;
export let dbset = set;
export let dbref = ref;
export let dbchild = child;
export let dbupdate = update;
