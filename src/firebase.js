import firebase from "firebase";
import("firebase/firestore");

let firebaseConfig = {
  apiKey: "AIzaSyCxpl2TWlFFszc1dy0GrQSa2B9Y7YqdO-E",
  authDomain: "access-control-9c6f2.firebaseapp.com",
  databaseURL: "https://access-control-9c6f2-default-rtdb.firebaseio.com",
  projectId: "access-control-9c6f2",
  storageBucket: "access-control-9c6f2.appspot.com",
  messagingSenderId: "3080079260",
  appId: "1:3080079260:web:90aa6521ac61ddc7c3aa59",
  measurementId: "G-659348FCJ0",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const auth = firebase.auth();

if (
  (process.env.REACT_APP_FIREBASE_STATUS = "test") &&
  process.env.NODE_ENV === "production"
) {
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", 8080);
}

export { db, auth };
