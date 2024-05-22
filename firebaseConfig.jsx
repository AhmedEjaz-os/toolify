// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAd0MDxHMwpidwlt_KoMKx9ZrmSxjgb3M",
  authDomain: "toolify-a54b6.firebaseapp.com",
  projectId: "toolify-a54b6",
  storageBucket: "toolify-a54b6.appspot.com",
  messagingSenderId: "354861036335",
  appId: "1:354861036335:web:8466e1533601ab894ce7da",
  measurementId: "G-M2142BCNBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);