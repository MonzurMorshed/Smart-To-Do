import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, register } from "../features/auth/authSlice";

export default function AuthForm() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === "login") {
                dispatch(login(email, password));
            } else {
                dispatch(register(email, password));
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto mt-20 border border-gray-100"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                {mode === "login" ? "Login" : "Register"} to Smart To-Do List
            </h2>

            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg w-full font-medium shadow hover:from-blue-600 hover:to-indigo-600 transition"
                >
                    {mode === "login" ? "Login" : "Register"}
                </button>
            </div>

            <p
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="mt-4 text-sm text-center text-blue-600 cursor-pointer hover:underline"
            >
                {mode === "login"
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
            </p>
        </form>

    );
}
