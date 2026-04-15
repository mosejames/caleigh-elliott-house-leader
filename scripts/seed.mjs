import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyALRlorzlHitmDcNzid5GpmeQ1WBiFk0wI',
  authDomain: 'caleigh-house-leader.firebaseapp.com',
  projectId: 'caleigh-house-leader',
  storageBucket: 'caleigh-house-leader.firebasestorage.app',
  messagingSenderId: '606689761306',
  appId: '1:606689761306:web:a9c7f171144f3cea73d9a3',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  console.log('Seeding Q&A data...')

  const questions = [
    {
      name: 'Marcus',
      question: "What's your first move as House Leader?",
      answer: 'Bring everyone together for a real kickoff. Not just a meeting. A moment.',
      status: 'answered',
      timestamp: Timestamp.now(),
    },
    {
      name: 'Aaliyah',
      question: 'Why should we trust you?',
      answer: "Because I've already been showing up. Check the receipts.",
      status: 'answered',
      timestamp: Timestamp.now(),
    },
    {
      name: 'Jordan',
      question: "What does 'together we are better' actually mean to you?",
      answer: 'It means nobody gets left behind. Not in class, not in competitions, not ever.',
      status: 'answered',
      timestamp: Timestamp.now(),
    },
  ]

  for (const q of questions) {
    const ref = await addDoc(collection(db, 'questions'), q)
    console.log(`  Added Q&A: "${q.question}" -> ${ref.id}`)
  }

  // Initialize pledge counter at 0
  await setDoc(doc(db, 'pledges', 'counter'), { count: 0 })
  console.log('  Initialized pledge counter at 0')

  console.log('Done! Seed data is live.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
