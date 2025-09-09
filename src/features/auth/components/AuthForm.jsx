import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, login, register } from "../authSlice";
import toast from "react-hot-toast";
import { LiaSignInAltSolid } from "react-icons/lia";
import { FaLock } from "react-icons/fa";
import {FcGoogle } from "react-icons/fc";
import ForgotPassword from "./ForgotPassword";


export default function AuthForm() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");

    const [forgotPassword,setForgotPassword] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(forgotPassword == 0) {
            try {
                if (mode === "login") {
                    try {
                        dispatch(login(email, password));
                        toast.success("You're successfully login !");
                    } catch (error) {
                        toast.error("Invalid email or password !");
                    }
                } else {
                    try {
                        dispatch(register(email, password));
                        toast.success("You're successfully register !");
                    } catch (error) {
                        toast.error("Something went wrong !");
                    }
                }
            } catch (error) {
                toast.error("Something went wrong !");
            }
        }
    };

    const handleGoogleSignin = async () => {
        try {
            await googleLogin();
            toast.success("You're successfully login !");
        } catch (err) {
            toast.error("Something went wrong !");
        }
    };

    const changeMode = () => {
        setForgotPassword(0);
        setMode(mode === "login" ? "register" : "login")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="glossy p-8 bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto mt-20 border border-gray-100"
        >
            <div className="w-full text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800 m-0 m-auto w-full">TodoAI</h2>
                <span className="text-md text-center text-[16px] font-semibold w-full">Smart AI Assistance</span>
            </div>

            {
                forgotPassword == 0 ? 
                    <div className="space-y-4 text-center">
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

                        {
                            mode == "login" ?
                                <>
                                    <button type="submit" className="saveBtn flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r hover:bg-gradient-to-l from-blue-500 to-indigo-500 text-white rounded-lg w-full font-medium shadow hover:from-blue-500 hover:to-indigo-600 transition text-[15px]"><LiaSignInAltSolid  className="mr-2 size-5" /> Login</button>
                                    <span className="font-semibold text-center p-2 table w-full">OR</span>
                                    <span onClick={handleGoogleSignin} className="saveBtn text-[15px] flex items-center justify-center gap-3  w-full py-3 px-5  border border-gray-300 dark:border-gray-600 hover:bg-gradient-to-l rounded-xl shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:from-blue-500 hover:to-indigo-600 transition-all duration-200 ease-in-out cursor-pointer font-semibold"> <FcGoogle  className="mr-2 size-5" /> Continue with Google</span>
                                </> : <button type="submit" className="saveBtn text-[15px] flex items-center justify-center gap-3  px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:bg-gradient-to-l rounded-lg w-full font-medium shadow hover:from-blue-500 hover:to-indigo-600 transition"><FaLock  className="mr-2 size-5" />Register</button>
                                    
                        }


                    </div>
                : <ForgotPassword forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>
            }


            <p
                onClick={changeMode}
                className="mt-4 text-md text-center text-gray cursor-pointer"
            >
                {mode === "login"
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
            </p>

            <p onClick={() => setForgotPassword(1)} className="mt-4 text-md text-center text-gray cursor-pointer">
                Forget Password ? Click Here
            </p>
            
        </form>

    );
}
