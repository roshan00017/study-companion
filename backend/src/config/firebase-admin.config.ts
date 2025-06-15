import admin from "firebase-admin";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID!;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY!;

const privateKey = firebasePrivateKey.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: privateKey,
  }),
});

export default admin;
