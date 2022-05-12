import { boot } from 'quasar/wrappers';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/analytics';

export default boot(({ app }) => {
  app.use(() => {
    if (firebase.apps.length) {
      return;
    }

    firebase.initializeApp({
      apiKey: 'AIzaSyD-jpBuDS62JRCG4ToXQBL-waNsHddHmJM',
      authDomain: 'ballstreetdao.firebaseapp.com',
      projectId: 'ballstreetdao',
      storageBucket: 'ballstreetdao.appspot.com',
      messagingSenderId: '1064898355267',
      appId: '1:1064898355267:web:882c16b380014e8ffe34f6',
    });

    firebase
      .firestore()
      .settings({ ignoreUndefinedProperties: true, merge: true });

    if (/localhost:/.exec(location.host)) {
      firebase.functions().useEmulator('localhost', 4202);
    } else {
      firebase.analytics();
    }
  });
});
