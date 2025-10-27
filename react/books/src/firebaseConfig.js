// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_urccqvZsgaT_aORrY5Iqmm_JsUaVHh0",
  authDomain: "books-cb183.firebaseapp.com",
  projectId: "books-cb183",
  storageBucket: "books-cb183.firebasestorage.app",
  messagingSenderId: "158135834117",
  appId: "1:158135834117:web:d68d2c3caaba823f10ae6c"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Firestoreインスタンスの取得
const db = getFirestore(app);

export default db;