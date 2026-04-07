import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

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

const NEW_EVENTS = [
  {
    name: 'Mehandi',
    date: '21st April 2026',
    venue: 'TBD',
    category: 'solo',
    description: 'Faculty: Ms. Sariya Anjum (CSE). Students: Noor Saba(CSE) 8050078179, Noor Zeba 8050078719',
    emoji: '🌿',
  },
  {
    name: 'Nail Art',
    date: '21st April 2026',
    venue: 'TBD',
    category: 'solo',
    description: 'Faculty: Ms. ThirthaShree G(ME). Students: Noor Saba(CSE) 8050078179, Shifa Kousar 6360179724',
    emoji: '💅',
  },
  {
    name: 'Cooking with fire',
    date: '22nd April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Sonia S(CSE), Mr. Sathyanarayan(ME), Mr. Gowrish Kappadi(ECE). Students: Hithesh(CSE) 9739727939, Ravi Kumar N Rao 9353395512',
    emoji: '🔥',
  },
  {
    name: 'Rangoli',
    date: '23rd April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Yashaswini P S (Maths), Ms. Suhasini N K(Phy). Students: Ashwini(CSE) 8951074405, Bhuvana D V 8618171922',
    emoji: '🎨',
  },
  {
    name: 'Pencil Sketch',
    date: '23rd April 2026',
    venue: 'TBD',
    category: 'solo',
    description: 'Faculty: Ms. Suhasini N K (Phy), Ms. Yashaswini P S (Maths). Student: Hemanth (CSE) 8073580159',
    emoji: '✏️',
  },
  {
    name: 'Best out of Waste',
    date: '24th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. ThirthaShree G(ME), Ms. Priyanka S (Che). Students: Chinmayee(CSE) 6366609590, Jayashree 8217785515',
    emoji: '♻️',
  },
  {
    name: 'Face Painting',
    date: '24th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Priyanka S (Che), Ms. ThirthaShree G (ME). Students: Chandana C N(CSE) 8660879137, Hampana N V 8792359094',
    emoji: '🎭',
  },
  {
    name: 'Cooking without fire',
    date: '25th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Priyanka S (Che), Ms. Suhasini N K(Phy). Students: Prajwal(ECE) 8867549337, Janardhan 8123480038',
    emoji: '🥗',
  },
  {
    name: 'Treasure Hunt',
    date: '28th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Dr. Divya S (AI&ML), Ms. Sariya Anjum(CSE). Students: Somshekar and Team(CSE) 8904680093',
    emoji: '🗺️',
  },
  {
    name: 'Skit',
    date: '29th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Harini H N (CV), Ms. Krishnaveni (ECE). Students: Krishna and Team(CSE) 7795273904',
    emoji: '🎭',
  },
  {
    name: 'Dance - Solo, Duet, Group',
    date: '29th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Ashwini T S (CSE), Ms. Ganavi Urs (MBA). Students: Aishwarya(CSE) 7483446463, Noor Zeba(CSE) 8050078719, Shifa Kousar(CSE) 6360179724, Deekshitha(ECE) 9035560823, Yashaswini.R(MBA), Vaibhavi S.M(MBA), Jayalakshmi (MBA)',
    emoji: '💃',
  },
  {
    name: 'Singing - Solo, Group',
    date: '29th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Ms. Harini H N (CV), Ms. Krishnaveni (ECE). Students: Rakshitha(ECE) 7259488195, Jeevitha 7353329246',
    emoji: '🎤',
  },
  {
    name: 'Fashion Show',
    date: '30th April 2026',
    venue: 'TBD',
    category: 'team',
    description: 'Faculty: Dr. Divya S(AI&ML), Ms. Dhanya K N (CSE), Ms. Sahana S (Maths). Students: Prajwal(MBA), Deekshitha(ECE) 9035560823, Tilak 7996876175',
    emoji: '👗',
  }
]

async function clearLeaderboard() {
  console.log("Clearing existing leaderboard results...")
  const snap = await getDocs(collection(db, 'results'))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  console.log(`✔ Cleared leaderboard (${snap.docs.length} result docs deleted)`)
}

async function addEvents() {
  console.log("Fetching existing events...")
  const existingSnap = await getDocs(collection(db, 'events'))
  const existingNames = new Set()
  existingSnap.forEach(d => existingNames.add(d.data().name))

  console.log("Adding new events without duplicates...")
  for (const ev of NEW_EVENTS) {
    if (!existingNames.has(ev.name)) {
      const ref = await addDoc(collection(db, 'events'), ev)
      console.log(`  ✔ Added new event: ${ev.name}`)
    } else {
      console.log(`  - Event already exists, skipping: ${ev.name}`)
    }
  }
}

async function main() {
  console.log('\n--- Updating System Data ---')
  await clearLeaderboard()
  await addEvents()
  console.log('\n✅ Data successfully updated.\n')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
