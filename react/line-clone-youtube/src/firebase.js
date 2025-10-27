import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDBik1nenJyvh30hWx4oXHyTvJmBWO9APE",
  authDomain: "line-clone-e9fc0.firebaseapp.com",
  projectId: "line-clone-e9fc0",
  storageBucket: "line-clone-e9fc0.appspot.com",
  messagingSenderId: "930686935344",
  appId: "1:930686935344:web:dc1003ece0d3512d2ba8f5"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };