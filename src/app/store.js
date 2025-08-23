import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import darkModeReducer from "../features/darkMode/darkModeSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        categories: categoriesReducer,
        darkMode: darkModeReducer
    }
});