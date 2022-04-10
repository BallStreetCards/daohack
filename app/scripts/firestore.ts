import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getNamedAccounts } from "hardhat";

import serviceAccount from "./ballstreetdao-firebase-adminsdk-zgwut-167257fe48";
import { propose, queueAndExecute, vote } from "./utils";

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const cards = {};
const votes = {};

db.collection("proposals").onSnapshot(async (snap) => {
  const docs = snap.docs.filter((doc) => !cards[doc.id]);
  // .map((doc) => ({ id: doc.id, ...doc.data() }));

  const { deployer } = await getNamedAccounts();

  docs.forEach(async (doc) => {
    const docData = (cards[doc.id] = doc.data());
    const proposalId = await propose(
      [docData.cardName],
      "mint", // mintCard
      `Mint card ${doc.id}`,
      deployer
    );
    await doc.ref.update({ proposalId, status: "proposed" });
  });

  const docsToMint = snap.docs.filter((doc) => doc.data().status === "mint");

  docsToMint.forEach(async (doc) => {
    await execute(doc.id);
  });
});

async function execute(proposalId: string) {
  const doc = await db.collection("proposals").doc(proposalId).get();
  const docData = doc.data();
  await queueAndExecute(
    [docData.cardName],
    "mint", // mintCard
    `Mint card ${doc.id}`
  );
  const result = await doc.ref.update({ proposalId });
  await doc.ref.update({ result, status: "executed" });
}

db.collection("votes").onSnapshot(async (snap) => {
  const docs = snap.docs.filter((doc) => !votes[doc.id]);
  // .map((doc) => ({ id: doc.id, ...doc.data() }));

  const { member1 } = await getNamedAccounts();

  docs.forEach(async (doc) => {
    const docData = (votes[doc.id] = doc.data());
    console.log(`Voting ${docData}`);
    await vote(
      docData.proposalId,
      docData.approve ? 1 : 0,
      docData.reason || "",
      docData.signer || member1
    );

    const proposalDoc = await db
      .collection("proposals")
      .doc(docData.docId)
      .get();
    await proposalDoc.ref.update({
      votes: FieldValue.increment(1),
      status: "voted",
    });
  });
});
