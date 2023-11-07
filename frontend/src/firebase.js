// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZN60EYkeH4171rtUXVXefdZFYqqasUn0",
  authDomain: "nlp-powered-bi.firebaseapp.com",
  projectId: "nlp-powered-bi",
  storageBucket: "nlp-powered-bi.appspot.com",
  messagingSenderId: "314387325482",
  appId: "1:314387325482:web:fbdcd5da39cb5b73479953"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;