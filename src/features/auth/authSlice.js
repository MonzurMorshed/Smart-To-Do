import { createSlice } from "@reduxjs/toolkit"
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const initialState = {
    user: null,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { uid, email, displayName, photoURL } = action.payload || {};
            state.user = uid
                ? { uid, email, displayName, photoURL }
                : null;
            state.loading = false;
        },
        logoutUser: (state) => {
            state.user = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = Boolean(action.payload);
        }
    }
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;

export const listenAuth = () => dispatch => {
    onAuthStateChanged(auth, user => {
        if (user) {
            const safeUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || ""
            };
            dispatch(setUser(safeUser));
        }
        else dispatch(logoutUser());
    });
};

export const login = (email, password) => async dispatch => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const register = (email, password) => async dispatch => {
    await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => async dispatch => {
    await signOut(auth);
    dispatch(logoutUser());
};

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

const googleProvider = new GoogleAuthProvider();
export const googleLogin = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export default authSlice.reducer;