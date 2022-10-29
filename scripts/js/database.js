// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDK5IcuhzK2rUsRlDnnn2LYNVniJHSDKWw",
    authDomain: "connected-c9e.firebaseapp.com",
    databaseURL: "https://connected-c9e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "connected-c9e",
    storageBucket: "connected-c9e.appspot.com",
    messagingSenderId: "50221072134",
    appId: "1:50221072134:web:9bbdba3b2e0ba86e746887",
    measurementId: "G-0CFRVYX7VZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);