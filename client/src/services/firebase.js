import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzDqV8Qt1RbcC6m6xkW9Y1edlFIQu_tjo",
  authDomain: "medagri.firebaseapp.com",
  projectId: "medagri",
  storageBucket: "medagri.firebasestorage.app",
  messagingSenderId: "905002905114",
  appId: "1:905002905114:web:1116f79e19fcd112f9eba3",
  measurementId: "G-L6XVN5KV1P"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();