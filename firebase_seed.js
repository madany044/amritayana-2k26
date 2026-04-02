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
const db  = getFirestore(app)

// ── Event data ───────────────────────────────────────────────

const EVENTS = [
  {
    name: 'Chess',
    date: 'Apr 18',
    venue: 'Main Hall, Block A',
    category: 'solo',
    description: 'Classic strategy game — outwit your opponent across timed rounds. Individual brilliance, no team to hide behind.',
    rules: [
      'Standard FIDE rules apply',
      'Time control: 15 min + 10 sec increment',
      'Round-robin; top 2 advance to knockout',
      'Report to venue 15 minutes before start',
      'Use of phones during play = disqualification',
    ],
    emoji: '♟',
  },
  {
    name: 'Table Tennis Doubles',
    date: 'Apr 18',
    venue: 'Sports Block, Court 2',
    category: 'doubles',
    description: 'Fast-paced doubles TT. Two players, one mission — smash the competition into the table.',
    rules: [
      'Standard ITTF doubles rules',
      'Best of 3 sets; each set to 11 points',
      'Both players must be from the same branch',
      'No coaching allowed during a set',
      'Players must bring their own rackets',
    ],
    emoji: '🏓',
  },
  {
    name: 'Tug of War',
    date: 'Apr 19',
    venue: 'Ground A',
    category: 'team',
    description: 'Pure strength and synchronized pulling. Eight bodies, one rope, one winner.',
    rules: [
      '8 members per team; up to 2 substitutes',
      'Combined team weight limit: 560 kg',
      '3 rounds — 2 wins qualify',
      'Proper footwear mandatory; no studs',
      'Rope crossing the centre mark = win',
    ],
    emoji: '💪',
  },
  {
    name: 'Volleyball',
    date: 'Apr 19',
    venue: 'Volleyball Court',
    category: 'team',
    description: 'Spike, set, serve — dominate the net with your branch team.',
    rules: [
      '6 members per team; 6 substitutes allowed',
      'Standard FIVB rules',
      'Best of 3 sets; rally scoring to 25 (3rd set to 15)',
      'Two 30-second timeouts per set per team',
      'Libero substitution rules apply',
    ],
    emoji: '🏐',
  },
  {
    name: 'Throwball',
    date: 'Apr 18',
    venue: 'Ground B',
    category: 'team',
    description: 'Speed, accuracy, fearless catching. Throw it hard, catch it clean, outscore the opposition.',
    rules: [
      'Women only event',
      '7 members per team; 3 substitutes',
      '3 sets of 25 points (rally point system)',
      'Ball must be thrown — not hit or spiked',
      'Foul on crossing the centre line',
    ],
    emoji: '🎯',
  },
  {
    name: 'Badminton',
    date: 'Apr 19',
    venue: 'Indoor Court',
    category: 'team',
    description: 'Smash and rally your way to glory through singles and doubles on the indoor court.',
    rules: [
      '4 members per team (2M + 2F recommended)',
      'Format: 2 singles + 1 mixed doubles',
      'BWF standard rules',
      'Shuttlecocks provided by organizers',
      'Each match: best of 3 games to 21',
    ],
    emoji: '🏸',
  },
  {
    name: 'Kabaddi',
    date: 'Apr 19',
    venue: 'Ground A',
    category: 'team',
    description: "Raid, tackle, hold your breath. India's oldest sport, raw and relentless.",
    rules: [
      '7 players on court; 3 substitutes',
      'Standard Amateur Kabaddi Federation rules',
      'Two halves of 20 minutes each',
      "Raider must chant 'kabaddi' continuously",
      'Anti-raiders must tackle without crossing baulk line',
    ],
    emoji: '🤸',
  },
  {
    name: 'Cricket',
    date: 'Apr 18',
    venue: 'Cricket Ground',
    category: 'team',
    description: 'T10 format — ten overs, tape ball, total chaos. Swing for the fences.',
    rules: [
      '11 members per team; 4 substitutes',
      'T10 format: 10 overs per side',
      'Tape ball cricket — no hard ball',
      'ICC rules adapted for T10',
      'Toss 10 minutes before scheduled start',
    ],
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
    { eventName: 'Chess',      branch: 'CSE',  position: 1 },
    { eventName: 'Chess',      branch: 'ISE',  position: 2 },
    { eventName: 'Chess',      branch: 'AIML', position: 3 },
    { eventName: 'Volleyball', branch: 'CSE',  position: 1 },
    { eventName: 'Volleyball', branch: 'MECH', position: 2 },
    { eventName: 'Volleyball', branch: 'ECE',  position: 3 },
    { eventName: 'Cricket',    branch: 'ISE',  position: 1 },
    { eventName: 'Cricket',    branch: 'CSE',  position: 2 },
    { eventName: 'Cricket',    branch: 'CIVIL',position: 3 },
  ]

  const POINTS = { 1: 10, 2: 6, 3: 3 }

  for (const r of sampleResults) {
    await addDoc(collection(db, 'results'), {
      eventId:  eventRefs[r.eventName],
      branch:   r.branch,
      position: r.position,
      points:   POINTS[r.position],
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
