import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } from './firebaseConfig';

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
