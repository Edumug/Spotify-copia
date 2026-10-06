import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXV_q1x5rHE2zofi7h1tNNWMHuv2CJz4s",
  authDomain: "clonespotify-c711f.firebaseapp.com",
  databaseURL: "https://clonespotify-c711f-default-rtdb.firebaseio.com/",
  projectId: "clonespotify-c711f",
  storageBucket: "clonespotify-c711f.firebasestorage.app",
  messagingSenderId: "39155582990",
  appId: "1:39155582990:web:6783da683ed2a3c6bf945f"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);