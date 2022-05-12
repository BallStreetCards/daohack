/* eslint-disable @typescript-eslint/no-explicit-any */

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
// import { deploySubDAO } from './deployer';
// import { getNamedAccounts } from 'hardhat';

// import { propose, queueAndExecute, vote } from './utils';

export function watchFirestore(): () => void {
  const db = getFirestore();

  const cards: { [key: string]: any } = {};
  const votes: { [key: string]: any } = {};

  async function execute(proposalId: string) {
    const doc = await db.collection('proposals').doc(proposalId).get();

    // TODO: Confirm voting results on blockchain

    // await deploySubDAO();
    await doc.ref.update({ status: 'executed' });
  }

  const unsub1 = db.collection('proposals').onSnapshot((snap) => {
    async function exec() {
      const docs = snap.docs.filter(
        (doc) => !cards[doc.id] && doc.data().status === 'drafted'
      );
      for (const doc of docs) {
        const docData = doc.data();
        console.log('Proposing', docData);

        // TODO: Create blockchain proposal

        const proposalId = '18';
        await doc.ref.update({ proposalId, status: 'proposed' });
      }

      const docsToMint = snap.docs.filter(
        (doc) => doc.data().status === 'mint'
      );

      for (const doc of docsToMint) {
        await execute(doc.id);
      }
    }
    void exec();
  });

  const unsub2 = db.collection('votes').onSnapshot((snap) => {
    async function exec() {
      const docs = snap.docs.filter((doc) => !votes[doc.id]);
      for (const doc of docs) {
        const docData = (votes[doc.id] = doc.data());
        console.log('Voting', docData);

        // TODO: Cast vote on blockchain, check if enough votes casted

        const proposalDoc = await db
          .collection('proposals')
          .doc(docData.docId)
          .get();

        if (!proposalDoc.exists) {
          await doc.ref.delete();
          break;
        }

        await proposalDoc.ref.update({
          votes: FieldValue.increment(1),
          approved: (docData.approve || false) as boolean,
          status: 'voted',
        });
      }
    }
    void exec();
  });

  return () => {
    unsub1();
    unsub2();
  };
}
