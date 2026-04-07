import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

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

async function migrateData() {
  console.log("Fetching events...")
  const eventSnap = await getDocs(collection(db, 'events'))
  const eventIdToName = {}
  eventSnap.forEach(eDoc => {
    eventIdToName[eDoc.id] = eDoc.data().name
  })
  
  console.log("Mapped Events:", eventIdToName)

  console.log("\nFetching registrations...")
  const regSnap = await getDocs(collection(db, 'registrations'))
  
  let updatedCount = 0;
  for (const registration of regSnap.docs) {
    const data = registration.data()
    // Update if event_name is missing or we want to normalize it
    if (!data.event_name || data.event_name === 'Unknown Event') {
       if (data.event_id) {
           const mappedName = eventIdToName[data.event_id]
           if (mappedName) {
               await updateDoc(doc(db, 'registrations', registration.id), {
                   event_name: mappedName
               })
               console.log(`  ✓ Updated registration ${registration.id} -> ${mappedName}`)
               updatedCount++
           } else {
               console.log(`  ! Warning: No event mapping found for ID ${data.event_id} (registration ${registration.id})`)
           }
       }
    }
  }
  
  console.log(`\n✅ Done! Successfully updated ${updatedCount} registrations.`)
}

migrateData().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
