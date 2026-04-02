import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

// ── Firebase config ─────────────────────────────────────────
// Get these from Firebase Console → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// ── EVENTS ───────────────────────────────────────────────────

/**
 * Fetch all events, sorted by name.
 * Firestore collection: "events"
 */
export async function fetchEvents() {
  const q = query(collection(db, 'events'), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Fetch a single event by its Firestore document ID.
 */
export async function fetchEventById(id) {
  const ref  = doc(db, 'events', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error(`Event not found: ${id}`)
  return { id: snap.id, ...snap.data() }
}

// ── REGISTRATIONS ────────────────────────────────────────────

/**
 * Submit a registration.
 * @param {Object} payload
 * @param {string}      payload.name
 * @param {string}      payload.semester
 * @param {string}      payload.branch
 * @param {string}      payload.contact
 * @param {string}      payload.event_id      — Firestore event document ID
 * @param {string|null} payload.team_name     — only for team events
 * @param {Array|null}  payload.team_members  — array of member objects
 */
export async function submitRegistration(payload) {
  const docRef = await addDoc(collection(db, 'registrations'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return { id: docRef.id, ...payload }
}

// ── LEADERBOARD ───────────────────────────────────────────────

/**
 * Compute leaderboard from the "results" collection.
 * Each document: { branch: string, position: 1|2|3 }
 * Returns: [{ branch, points }] sorted descending.
 */
export async function fetchLeaderboard() {
  const snap = await getDocs(collection(db, 'results'))
  const POINTS = { 1: 10, 2: 6, 3: 3 }
  const totals = {}

  snap.docs.forEach(d => {
    const { branch, position } = d.data()
    const pts = POINTS[position] ?? 0
    totals[branch] = (totals[branch] ?? 0) + pts
  })

  return Object.entries(totals)
    .map(([branch, points]) => ({ branch, points }))
    .sort((a, b) => b.points - a.points)
}
