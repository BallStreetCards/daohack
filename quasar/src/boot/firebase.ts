import { boot } from 'quasar/wrappers';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  app.use(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyD-jpBuDS62JRCG4ToXQBL-waNsHddHmJM',
        authDomain: 'ballstreetdao.firebaseapp.com',
        projectId: 'ballstreetdao',
        storageBucket: 'ballstreetdao.appspot.com',
        messagingSenderId: '1064898355267',
        appId: '1:1064898355267:web:882c16b380014e8ffe34f6',
      });

      firebase.firestore().settings({ ignoreUndefinedProperties: true });

      // TODO: Enable this to use emulator for local dev
      // if (/localhost:/.exec(location.host)) {
      //   firebase.functions().useEmulator('localhost', 5001);
      // }
    }
  });
});
