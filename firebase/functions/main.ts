import serviceAccount from './ballstreetdao-firebase-adminsdk-zgwut-167257fe48';
import { initializeApp, cert } from 'firebase-admin/app';
import { watchFirestore } from './src/governor';

initializeApp({
  credential: cert(serviceAccount),
});

watchFirestore();
