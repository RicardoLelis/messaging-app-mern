import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';        // for authentication
import 'firebase/compat/storage';     // for storage
import 'firebase/compat/database';    // for realtime database
import 'firebase/compat/firestore';   // for cloud firestore

import config from './config.js'

const firebaseConfig = {
    apiKey: config.firebaseConfig.apiKey,
    authDomain: config.firebaseConfig.authDomain,
    projectId: config.firebaseConfig.projectId,
    storageBucket: config.firebaseConfig.storageBucket,
    messagingSenderId: config.firebaseConfig.messagingSenderId,
    appId: config.firebaseConfig.appId
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
export { auth, provider }
export default db