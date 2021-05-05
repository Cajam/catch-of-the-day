import Rebase from "re-base";
import firebase from "firebase";

 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp  = firebase.initializeApp({
  apiKey: "AIzaSyDquvyIwzZc3RbLzBGqU-7k-08a2_q7w3s",
  authDomain: "catch-of-the-day-64008.firebaseapp.com",
  projectId: "catch-of-the-day-64008",
  storageBucket: "catch-of-the-day-64008.appspot.com",
  messagingSenderId: "692893382698",
  appId: "1:692893382698:web:4666fd842cbbaee80beb53",
  measurementId: "G-17Q8K90XGM"
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// this is a default export
export default base;
