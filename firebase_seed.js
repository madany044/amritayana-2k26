// firebase_seed.js
// Run this ONCE to populate your Firestore database.
//
// Prerequisites:
//   npm install firebase
//
// Usage:
//   node firebase_seed.js
//
// Make sure to set your firebaseConfig below before running.

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

// ── Paste your Firebase config here ─────────────────────────
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// ── Event data ───────────────────────────────────────────────

const EVENTS = [
  {
    name: 'Table Tennis Doubles (Boys & Girls)',
    date: '7th April',
    venue: 'Sports room',
    category: 'doubles',
    description: 'Faculty Coordinator: Mr Sudeep. Student Coordinator: Somashekar (CSE) Krishna (CSE).',
    emoji: '🏓',
  },
  {
    name: 'Chess (Boys & Girls)',
    date: '8th April',
    venue: 'Sports room',
    category: 'solo',
    description: 'Faculty Coordinators: Prof Sathyanarayan, Mr Sudeep. Student Coordinators:Somashekar,Nihal,Bindushree .',
    emoji: '♟',
  },
  {
    name: 'Staff Badminton (Men\'s & Women\'s)',
    date: '9th & 10th April',
    venue: 'MRIT Badminton court',
    category: 'doubles',
    description: 'Faculty Coordinator: Prof Raghu. Student Coordinator: Keerthan (ECE) 6366201248, Deekshitha V (ECE) 9035560823 ',
    emoji: '🏸',
  },
  {
    name: 'Tug of War (Boys & Girls)',
    date: '11th April',
    venue: 'MRIT Ground',
    category: 'team',
    description: 'Faculty Coordinators: Prof Dhanya, Prof Divya. Student Coordinators: Manoj (ECE) 6363902189, Keerthan(ECE).',
    emoji: '💪',
  },
  {
    name: 'Volleyball (Boys)',
    date: '15th April',
    venue: 'Volleyball Court',
    category: 'team',
    description: 'Faculty Coordinators: Prof Dhanya, Mr Sudeep. Student Coordinators: Bindan (ECE) 8050246496, Deekshitha V (ECE) 9035560823, Tharun.',
    emoji: '🏐',
  },
  {
    name: 'Throwball (Girls)',
    date: '15th April',
    venue: 'Throwball Court',
    category: 'team',
    description: 'Faculty Coordinators: Prof Harshitha, Mr Sudeep. Student Coordinator: Krishna (CSE) 779527304, Somashekar (CSE).',
    emoji: '🎯',
  },
  {
    name: 'Badminton (Boys & Girls)',
    date: '16th & 17th April',
    venue: 'MRIT Badminton Court',
    category: 'doubles',
    description: 'Faculty Coordinators: Mr Sudeep, Prof Bhoomika. Student Coordinators: Hemanth C(CSE) 8073580159 , Madan Y(CSE).',
    emoji: '🏸',
  },
  {
    name: 'Kabaddi (Boys & Girls)',
    date: '18th April',
    venue: 'Kabaddi Court',
    category: 'team',
    description: 'Faculty Coordinators: Dr Nakul N, Dr Bharathesh Patel N. Student Coordinators: Somashekar (CSE) , Krishna (CSE).',
    emoji: '🤸',
  },
  {
    name: 'Cricket (Boys)',
    date: '21st, 22nd & 23rd April',
    venue: 'MRIT Ground',
    category: 'team',
    description: 'Faculty Coordinators: Mr Raghu, Mr Sudeep. Student Coordinators: Somashekar (CSE) , Prithvik (CSE) .',
    emoji: '🏏',
  },
]

// ── Seed functions ───────────────────────────────────────────

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  console.log(`  Cleared "${name}" (${snap.docs.length} docs deleted)`)
}

async function seedEvents() {
  const refs = {}
  for (const ev of EVENTS) {
    const ref = await addDoc(collection(db, 'events'), ev)
    refs[ev.name] = ref.id
    console.log(`  ✓ Event: ${ev.name} (${ref.id})`)
  }
  return refs
}

async function seedResults(eventRefs) {
  const sampleResults = [
    { eventName: 'Chess (Boys & Girls)', branch: 'CSE', position: 1 },
    { eventName: 'Chess (Boys & Girls)', branch: 'ISE', position: 2 },
    { eventName: 'Chess (Boys & Girls)', branch: 'AIML', position: 3 },
    { eventName: 'Volleyball (Boys)', branch: 'CSE', position: 1 },
    { eventName: 'Volleyball (Boys)', branch: 'MECH', position: 2 },
    { eventName: 'Volleyball (Boys)', branch: 'ECE', position: 3 },
    { eventName: 'Cricket (Boys)', branch: 'ISE', position: 1 },
    { eventName: 'Cricket (Boys)', branch: 'CSE', position: 2 },
    { eventName: 'Cricket (Boys)', branch: 'CIVIL', position: 3 },
  ]

  const POINTS = { 1: 10, 2: 6, 3: 3 }

  for (const r of sampleResults) {
    await addDoc(collection(db, 'results'), {
      eventId: eventRefs[r.eventName],
      branch: r.branch,
      position: r.position,
      points: POINTS[r.position],
    })
    console.log(`  ✓ Result: ${r.eventName} — ${r.branch} (${r.position}st/nd/rd)`)
  }
}

// ── Run ──────────────────────────────────────────────────────

async function main() {
  console.log('\n🔥 Firebase Seed Script — IGNITE\'25\n')

  console.log('Clearing existing data...')
  await clearCollection('events')
  await clearCollection('results')

  console.log('\nSeeding events...')
  const eventRefs = await seedEvents()

  console.log('\nSeeding sample results...')
  await seedResults(eventRefs)

  console.log('\n✅ Done! Your Firestore is ready.\n')
  process.exit(0)
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
