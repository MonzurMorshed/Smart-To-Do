import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useDispatch } from "react-redux";

export const taskCol = (uid) => collection(db,`users/${uid}/tasks`);
export const categoriesCol = (uid) => collection(db, `users/${uid}/categories`);

export const subscribeTasks = (uid, callback) => {
    const q = query(taskCol(uid),orderBy('createdAt','desc'));
    return onSnapshot(q, snapshot => {
        const tasks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                notes: data.notes,
                category: data.category,
                priority: data.priority,
                due: data.due,
                completed: data.completed,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || null,
            };
        });
        callback(tasks);
    });
}

export const addTask = (uid, task) => {
    addDoc(taskCol(uid),{
        title: task.title,
        notes: task.notes,
        category: task.category,
        priority: task.priority,
        due: task.due,
        completed: false,
        createdAt: new Date().toISOString(),
    });
}
export const updateTask = (payload) => {
    updateDoc(doc(db, `users/${payload.uid}/tasks/${payload.id}`), 
        payload.updates
    )
};
export const deleteTask = (uid, id) => deleteDoc(doc(db, `users/${uid}/tasks/${id}`));

export const subscribeCategories = (uid, callback) => {
  const q = query(categoriesCol(uid), orderBy("name"));
  return onSnapshot(q, snapshot => {
    const categories = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            createdAt: data.createdAt?.toDate()
        };
    });
    callback(categories);
  });
};

export const addCategory = async (uid, category) => {
    const docRef = await addDoc(categoriesCol(uid),  {
        name: category,
        createdAt: new Date().toISOString(),
    });
}
export const updateCategory = (uid, id, updates) => updateDoc(doc(db, `users/${uid}/categories/${id}`), updates);
export const deleteCategory = (uid, id) => deleteDoc(doc(db, `users/${uid}/categories/${id}`));