import { createSlice } from "@reduxjs/toolkit";
import { subscribeCategories, addCategory as addCategoryFirebase } from "../../firebase/firestoreService";

const cachedCategories = (() => {
  try {
    const raw = localStorage.getItem("smart-todo.categories");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

const initialState = { categories: cachedCategories };

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => { state.categories = action.payload; }
  }
});

export const { setCategories } = categoriesSlice.actions;

export const listenCategories = (uid) => dispatch => {
  return subscribeCategories(uid, cats => {
    const safeCats = cats.map(c => ({
      ...c,
      createdAt: c.createdAt instanceof Date ? c.createdAt.getTime() : c.createdAt
    }));
    dispatch(setCategories(safeCats));
    localStorage.setItem("smart-todo.categories", JSON.stringify(safeCats));

  });
};

export const addCategory = (uid, cat) => async dispatch => {
  await addCategoryFirebase(uid, cat);
};

export default categoriesSlice.reducer;
