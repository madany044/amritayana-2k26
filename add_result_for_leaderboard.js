import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAlh6Li0kqE3pKwd64CPHHkgY0ZNopqC74",
  authDomain: "amritayana-2k26-69f8f.firebaseapp.com",
  projectId: "amritayana-2k26-69f8f",
  storageBucket: "amritayana-2k26-69f8f.firebasestorage.app",
  messagingSenderId: "173080845296",
  appId: "1:173080845296:web:1865a052626cf99183db35",
  measurementId: "G-PS4R5MFXYF"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// =========================================================
// HOW TO ADD TO THE LEADERBOARD
// 
// When an event happens and someone wins, update the values 
// in this WINNER_DATA object down below, and run the file using: 
//     node add_result_for_leaderboard.js
// 
// Points are automatically assigned based on position: 
// 1st = 10 pts, 2nd = 6 pts, 3rd = 3 pts
// =========================================================

const WINNER_DATA = {
  eventName: "Mehandi",   // MUST match exactly an event name in the database
  branch: "CSE",          // Branch of the winner (e.g. "CSE", "ECE", "MECH")
  position: 1             // Position: 1 for 1st, 2 for 2nd, 3 for 3rd
}

const POINTS = { 1: 10, 2: 6, 3: 3 }

async function publishWinningResult() {
  console.log(`\n🏆 Giving ${WINNER_DATA.position} position to ${WINNER_DATA.branch} in ${WINNER_DATA.eventName}...`)
  
  // 1. Get the event ID by its name
  const q = query(collection(db, 'events'), where('name', '==', WINNER_DATA.eventName))
  const snap = await getDocs(q)
  
  if (snap.empty) {
    console.error(`❌ Error: Event "${WINNER_DATA.eventName}" not found! Make sure you typed the name correctly.`)
    process.exit(1)
  }
  
  const eventDoc = snap.docs[0] // take the first matched event
  
  // 2. Insert into the results collection
  const newResult = {
    eventId: eventDoc.id,
    branch: WINNER_DATA.branch,
    position: WINNER_DATA.position,
    points: POINTS[WINNER_DATA.position] || 0
  }
  
  await addDoc(collection(db, 'results'), newResult)
  console.log(`✅ Success! Added ${POINTS[WINNER_DATA.position]} points to ${WINNER_DATA.branch} on the leaderboard.\n`)
}

publishWinningResult().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) });
