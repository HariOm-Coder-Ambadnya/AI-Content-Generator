// src/lib/firestore.js
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, where, orderBy, serverTimestamp, limit
} from 'firebase/firestore'
import { db } from './firebase'

export async function saveGeneration(userId, data) {
  return addDoc(collection(db, 'generations'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function getUserGenerations(userId, maxItems = 50) {
  const q = query(
    collection(db, 'generations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function deleteGeneration(generationId) {
  return deleteDoc(doc(db, 'generations', generationId))
}
