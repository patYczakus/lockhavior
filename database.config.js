import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsb6loLyJAXBeqxHnvTCcycOFuJgmiYX8",
    authDomain: "connected-e193d.firebaseapp.com",
    projectId: "connected-e193d",
    storageBucket: "connected-e193d.appspot.com",
    messagingSenderId: "568142385993",
    appId: "1:568142385993:web:5ab157d56542eaa52e4098",
    measurementId: "G-R7EZWGK5WX"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);