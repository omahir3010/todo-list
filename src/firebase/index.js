import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDc9XEvBibM1LPXynFRZa8s4YeK2I1mC-o",
  authDomain: "todo-items-308dd.firebaseapp.com",
  projectId: "todo-items-308dd",
  storageBucket: "todo-items-308dd.appspot.com",
  messagingSenderId: "856041617869",
  appId: "1:856041617869:web:a1beeac6b3891ae44aec84"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{
    db
}