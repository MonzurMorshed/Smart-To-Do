import { createSlice } from "@reduxjs/toolkit";
import { subscribeTasks, addTask as addTaskFirebase, updateTask as updateTaskFirebase, deleteTask as deleteTaskFirebase } from "../../firebase/firestoreService";

const cachedTasks = (() => {
  try {
    const raw = localStorage.getItem("smart-todo.tasks");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

const initialState = {
    tasks: cachedTasks
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      setTasks:(state, action) => {
        state.tasks = action.payload;
      },
      reorderTasks: (state, action) => {
        const { from, to } = action.payload;
        if (from === to) return;
        const updated = [...state.tasks];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        state.tasks = updated;
      },
    }
});

export const { setTasks, reorderTasks } = tasksSlice.actions;

export const listenTasks = (uid) => dispatch => {
    return subscribeTasks(uid, tasks => {
      dispatch(setTasks(tasks));
      localStorage.setItem("smart-todo.tasks", JSON.stringify(tasks));
    });
};

export const addTask = (uid, task) => async dispatch => {
  await addTaskFirebase(uid, task);
};

export const updateTask = (uid, id, updates) => async dispatch => {
  await updateTaskFirebase(uid, id, updates);
};

export const deleteTask = (uid, id) => async dispatch => {
  await deleteTaskFirebase(uid, id);
};


export default tasksSlice.reducer;