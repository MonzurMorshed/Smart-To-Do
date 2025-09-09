import { useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "../authSlice";
import { FaPlane } from "react-icons/fa";

export default function ForgotPassword({forgotPassword,setForgotPassword}) {
  
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if(email == "") {
        toast.error('Please enter email address.');
        return false;
    }
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
      setForgotPassword(0);
    } catch (err) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="glossy p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center w-full">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="input w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="saveBtn text-[15px] flex items-center justify-center gap-3  px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg w-full font-medium shadow hover:from-blue-600 hover:to-indigo-600 transition"
      >
        <FaPlane  className="mr-2 size-5" />Send Reset Link
      </button>
    </div>
  );
}
