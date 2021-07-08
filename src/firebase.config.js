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
let firebaseApp
if (firebase.apps.length===0) {
  firebaseApp = firebase.initializeApp(firebaseConfig);

}else {
  firebaseApp = firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();


export const cc = 12
export default db;
