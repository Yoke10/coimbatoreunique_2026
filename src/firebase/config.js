// Firebase configuration
// Replace these values with your actual Firebase project credentials

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC71HTePW6ir1Nk-AlMsUW-pyuDkfFTWXo",
    authDomain: "coimbatoreuniquebackend.firebaseapp.com",
    projectId: "coimbatoreuniquebackend",
    storageBucket: "coimbatoreuniquebackend.firebasestorage.app",
    messagingSenderId: "185302419552",
    appId: "1:185302419552:web:4aca100cd3c8784b7e5b05"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
