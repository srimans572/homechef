// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwOticSYLYUscRPMHn0AQ1fR3cONcEc6s",
  authDomain: "soundtours-bbdf7.firebaseapp.com",
  projectId: "soundtours-bbdf7",
  storageBucket: "soundtours-bbdf7.appspot.com",
  messagingSenderId: "418495033800",
  appId: "1:418495033800:web:f516a84d988fe8356dd0fd",
  measurementId: "G-3P65FFED2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app)