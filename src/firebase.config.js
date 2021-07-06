import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAnO8aMZ6vLkRxm-mQKsO59I-AzLvHaQgA",
  authDomain: "hymnmusicsheet.firebaseapp.com",
  projectId: "hymnmusicsheet",
  storageBucket: "hymnmusicsheet.appspot.com",
  messagingSenderId: "370835269189",
  appId: "1:370835269189:web:e870aa5f329aa32585652c",
  measurementId: "G-2FPVP955VW"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
