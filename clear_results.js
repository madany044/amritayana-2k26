import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyAlh6Li0kqE3pKwd64CPHHkgY0ZNopqC74",
  projectId: "amritayana-2k26-69f8f"
});
const db = getFirestore(app);

getDocs(collection(db, "results"))
  .then(snap => Promise.all(snap.docs.map(d => deleteDoc(d.ref))))
  .then(() => {
    console.log("Cleared results");
    process.exit(0);
  });
