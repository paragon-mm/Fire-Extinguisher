import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "radiant-trilogy-kq6d2",
  appId: "1:337161836767:web:d2e1848a058f877ddd316a",
  apiKey: "AIzaSyBoxqixhPRLVYo9SitX4NRmI_e7jykoRSo",
  authDomain: "radiant-trilogy-kq6d2.firebaseapp.com",
  storageBucket: "radiant-trilogy-kq6d2.firebasestorage.app",
  messagingSenderId: "337161836767"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-gcmpta-d5603f20-a597-49c3-bb94-e64d71a92d5d");
