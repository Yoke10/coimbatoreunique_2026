
import { db, auth, storage } from '../firebase/config';
import {
    collection, getDocs, addDoc, deleteDoc, doc, updateDoc,
    query, where, orderBy
} from 'firebase/firestore';
import {
    signInWithEmailAndPassword, signOut
} from 'firebase/auth';
import {
    ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';

const COLLECTIONS = {
    EVENTS: 'events',
    BULLETINS: 'bulletins',
    SCRAPBOOKS: 'scrapbooks',
    GALLERY: 'gallery',
    SUPPORT: 'support',
    JOIN_REQUESTS: 'join_requests',
    REPORTS: 'reports',
    USERS: 'members', // 'users' is often reserved or confusing with Auth
    CONFIG: 'club_config',
    SENT_LOGS: 'sent_logs',
    RESOURCES: 'resources',
    BOARD: 'board_members',
    TEMPLATES: 'email_templates'
};

// Helper to map doc snapshot to object
const mapDoc = (doc) => ({ id: doc.id, ...doc.data() });

export const firebaseService = {
    // --- AUTHENTICATION ---
    login: async (username, password, role) => {
        // NOTE: Firebase Auth requires EMAIL. 
        // If app passes username, we assume it's actually an email OR we need to lookup email by username.
        // For now, assuming username IS email or we append a domain if strictly username?
        // Let's assume input is Email for standard Firebase Auth.
        // If the legacy app sends "admin" (username), this will fail.

        // AUTO-FIX for legacy "admin" or "member" usernames
        let email = username;
        if (username === 'admin') email = 'admin@rotaract.com';
        if (username === 'member') email = 'member@rotaract.com';

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get extra profile details from Firestore 'members' collection
            // We assume the auth.uid matches the document ID or we query by email
            // Let's try to find the user profile in Firestore

            // Note: In a real app, you'd store custom claims or look up the profile.
            // Returning a mock-like object to satisfy the frontend expectation.
            return {
                id: user.uid,
                username: email.split('@')[0], // Fallback
                email: user.email,
                role: role || 'member', // Firebase Auth doesn't store role by default, simplistic approach
                profile: {
                    fullName: user.displayName || 'Member',
                    email: user.email
                }
            };
        } catch (error) {
            console.error("Firebase Login Error:", error);
            throw new Error(error.message);
        }
    },

    logout: async () => {
        await signOut(auth);
        sessionStorage.removeItem('rotaract_session_user');
    },

    getCurrentUser: () => {
        // Firebase Auth is async, but this is a synchronous helper in the old app.
        // We stick to sessionStorage for synchronous access if needed, 
        // but typically should use onAuthStateChanged.
        const userStr = sessionStorage.getItem('rotaract_session_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // --- GENERIC CRUD HELPERS ---
    getAll: async (collectionName) => {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(mapDoc);
    },

    add: async (collectionName, data) => {
        const docRef = await addDoc(collection(db, collectionName), data);
        return { id: docRef.id, ...data };
    },

    delete: async (collectionName, id) => {
        await deleteDoc(doc(db, collectionName, id));
    },

    update: async (collectionName, id, data) => {
        await updateDoc(doc(db, collectionName, id), data);
        return { id, ...data };
    },

    // --- SPECIFIC METHODS (Mapping mockDataService) ---

    // EVENTS
    getEvents: () => firebaseService.getAll(COLLECTIONS.EVENTS),
    addEvent: (event) => firebaseService.add(COLLECTIONS.EVENTS, event),
    deleteEvent: (id) => firebaseService.delete(COLLECTIONS.EVENTS, id),
    updateEvent: (id, updates) => firebaseService.update(COLLECTIONS.EVENTS, id, updates),

    // BULLETINS
    getBulletins: () => firebaseService.getAll(COLLECTIONS.BULLETINS),
    addBulletin: (item) => firebaseService.add(COLLECTIONS.BULLETINS, item),
    deleteBulletin: (id) => firebaseService.delete(COLLECTIONS.BULLETINS, id),
    updateBulletin: (id, updates) => firebaseService.update(COLLECTIONS.BULLETINS, id, updates),

    // SCRAPBOOKS
    getScrapbooks: () => firebaseService.getAll(COLLECTIONS.SCRAPBOOKS),
    addScrapbook: (item) => firebaseService.add(COLLECTIONS.SCRAPBOOKS, item),
    deleteScrapbook: (id) => firebaseService.delete(COLLECTIONS.SCRAPBOOKS, id),
    updateScrapbook: (id, updates) => firebaseService.update(COLLECTIONS.SCRAPBOOKS, id, updates),

    // GALLERY (With Storage Support)
    getGallery: () => firebaseService.getAll(COLLECTIONS.GALLERY),

    // Custom upload logic needed for Gallery? 
    // The current mock service just stores URLs. 
    // If we want real file upload, we need a new method `uploadImage`
    addGalleryItem: (item) => firebaseService.add(COLLECTIONS.GALLERY, item),
    deleteGalleryItem: (id) => firebaseService.delete(COLLECTIONS.GALLERY, id),
    updateGalleryItem: (id, updates) => firebaseService.update(COLLECTIONS.GALLERY, id, updates),

    // SUPPORT
    getSupportMessages: () => firebaseService.getAll(COLLECTIONS.SUPPORT),
    addSupportMessage: (msg) => firebaseService.add(COLLECTIONS.SUPPORT, msg),
    deleteSupportMessage: (id) => firebaseService.delete(COLLECTIONS.SUPPORT, id),

    // JOIN REQUESTS
    getJoinRequests: () => firebaseService.getAll(COLLECTIONS.JOIN_REQUESTS),
    addJoinRequest: (req) => firebaseService.add(COLLECTIONS.JOIN_REQUESTS, req),
    deleteJoinRequest: (id) => firebaseService.delete(COLLECTIONS.JOIN_REQUESTS, id),
    updateJoinRequest: (id, updates) => firebaseService.update(COLLECTIONS.JOIN_REQUESTS, id, updates),

    // REPORTS
    getReports: () => firebaseService.getAll(COLLECTIONS.REPORTS),
    addReport: (report) => firebaseService.add(COLLECTIONS.REPORTS, report),
    deleteReport: (id) => firebaseService.delete(COLLECTIONS.REPORTS, id),
    updateReport: (id, updates) => firebaseService.update(COLLECTIONS.REPORTS, id, updates),

    // USERS / MEMBERS
    getUsers: () => firebaseService.getAll(COLLECTIONS.USERS),
    addUser: (user) => firebaseService.add(COLLECTIONS.USERS, user), // This creates a record, not Auth user
    deleteUser: (id) => firebaseService.delete(COLLECTIONS.USERS, id),
    updateUser: (id, updates) => firebaseService.update(COLLECTIONS.USERS, id, updates),

    // RESOURCES
    getResources: () => firebaseService.getAll(COLLECTIONS.RESOURCES),
    addResource: (res) => firebaseService.add(COLLECTIONS.RESOURCES, res),
    deleteResource: (id) => firebaseService.delete(COLLECTIONS.RESOURCES, id),
    updateResource: (id, updates) => firebaseService.update(COLLECTIONS.RESOURCES, id, updates),

    // BOARD MEMBERS
    getBoardMembers: () => firebaseService.getAll(COLLECTIONS.BOARD),
    addBoardMember: (member) => firebaseService.add(COLLECTIONS.BOARD, member),
    deleteBoardMember: (id) => firebaseService.delete(COLLECTIONS.BOARD, id),
    updateBoardMember: (id, updates) => firebaseService.update(COLLECTIONS.BOARD, id, updates),

    // STORAGE HELPERS (New)
    uploadFile: async (file, path) => {
        if (!file) return null;
        const storageRef = ref(storage, path || `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }
};
