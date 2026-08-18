import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "radiant-trilogy-kq6d2",
  appId: "1:337161836767:web:d2e1848a058f877ddd316a",
  apiKey: "AIzaSyBoxqixhPRLVYo9SitX4NRmI_e7jykoRSo",
  authDomain: "radiant-trilogy-kq6d2.firebaseapp.com",
  storageBucket: "radiant-trilogy-kq6d2.firebasestorage.app",
  messagingSenderId: "337161836767"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-f9757dc9-2239-4ed0-9eca-8b9c89894659");
export const auth = getAuth(app);
