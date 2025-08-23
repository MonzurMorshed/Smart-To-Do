import { createSlice } from "@reduxjs/toolkit";
import { subscribeCategories, addCategory as addCategoryFirebase } from "../../firebase/firestoreService";

const initialState = { categories: [] };

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
    dispatch(setCategories(safeCats))
  });
};

export const addCategory = (uid, cat) => async dispatch => {
  await addCategoryFirebase(uid, cat);
};

export default categoriesSlice.reducer;
