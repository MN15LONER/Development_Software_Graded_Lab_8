const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');


const firebaseConfig = {
  apiKey: "AIzaSyBEtYHZdhmqTjBrHyXA-QQwX74uRV8DvVM",
  authDomain: "projecttracker-ffafb.firebaseapp.com",
  projectId: "projecttracker-ffafb",
  storageBucket: "projecttracker-ffafb.firebasestorage.app",
  messagingSenderId: "54936357913",
  appId: "1:54936357913:web:c8fe5472ed6bc178bdae88"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProjects = [
  {
    name: "Mobile App Development",
    taskCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Website Redesign",
    taskCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Marketing Campaign",
    taskCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Database Migration",
    taskCount: 0,
    createdAt: new Date().toISOString(),
  },
];

async function initializeData() {
  console.log('🚀 Starting Firebase initialization...\n');

  try {
    console.log('📝 Adding sample projects...');
    for (const project of sampleProjects) {
      const docRef = await addDoc(collection(db, 'projects'), project);
      console.log(`✅ Added project: "${project.name}" (ID: ${docRef.id})`);
    }

    console.log('\n✨ Firebase initialization completed successfully!');
    console.log('\n📱 You can now run your app with: npm start');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error('\n💡 Make sure you have:');
    console.error('   1. Updated firebaseConfig.js with your credentials');
    console.error('   2. Created a Firestore database in Firebase Console');
    console.error('   3. Set Firestore rules to allow read/write (test mode)');
    process.exit(1);
  }
}

initializeData();
