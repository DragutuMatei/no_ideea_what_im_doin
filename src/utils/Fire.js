import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default class Fire {
  constructor() {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_APIKEY,
      authDomain: process.env.REACT_APP_AUTHDOMAIN,
      projectId: process.env.REACT_APP_PROJECTID,
      storageBucket: process.env.REACT_APP_STORAGEBUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
      appId: process.env.REACT_APP_APPID,
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore();
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
  }

  getDb() {
    return this.db;
  }

  async logout() {
    await signOut(this.auth);
  }

  getuser() {
    return this.auth;
  }

  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(this.auth, this.googleProvider);
      const user = res.user;
      const q = query(
        collection(this.db, "users"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(this.db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async addItem(collectionName, product) {
    const db = getFirestore();
    const productsRef = collection(db, collectionName);

    return await addDoc(productsRef, product).then((docRef) => {
      return { id: docRef.id, ...product };
    });
  }

  async readDocuments(collectionName, condition, limitare) {
    let q;

    if (condition == undefined || condition[2] === "all") {
      q = query(collection(this.db, collectionName));
    } else if (
      condition !== undefined &&
      limitare == undefined &&
      typeof condition[2] !== "number" &&
      condition[2].includes("search")
    ) {
      q = query(collection(this.db, collectionName));
    } else if (limitare == undefined) {
      q = query(
        collection(this.db, collectionName),
        where(condition[0], condition[1], condition[2])
      );
    } else {
      q = query(
        collection(this.db, collectionName),
        where(condition[0], condition[1], condition[2]),
        limit(limitare),
        orderBy("rating", "desc")
      );
    }
    const querySnapshot = await getDocs(q);
    const documents = [];
    if (
      condition !== undefined &&
      typeof condition[2] !== "number" &&
      condition[2].includes("search")
    ) {
      condition[2] = condition[2].slice(6);
      querySnapshot.forEach((doc) => {
        if (doc.get("nume").includes(condition[2])) {
          documents.push({ id: doc.id, ...doc.data() });
        }
      });
    } else {
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
    }

    return documents;
  }

  async getDocById(col, productId) {
    const docRef = doc(this.db, col, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  }

  async updateDocument(collectionName, documentId, data) {
    const ref = doc(this.db, collectionName, documentId);
    return await updateDoc(ref, data);
  }
  async deleteDocument(collectionName, documentId) {
    await deleteDoc(doc(this.db, collectionName, documentId));
  } 
}
