// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDg63_9mCX-W6dz3D-lHvGdDvjQX0zvmAs",
  authDomain: "dailychallenges-app.firebaseapp.com",
  projectId: "dailychallenges-app",
  storageBucket: "dailychallenges-app.firebasestorage.app",
  messagingSenderId: "362613210857",
  appId: "1:362613210857:web:436de891661a7bd8d0ba78",
  measurementId: "G-ENZPK4TMDN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app)

export { app, auth, firestore };
