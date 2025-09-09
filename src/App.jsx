import React, { useEffect } from 'react';
import AuthForm from './features/auth/components/AuthForm';
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { listenAuth } from './features/auth/authSlice';
import Loader from './components/Loader';
import MainComponent from './components/MainComponent';
import Footer from './components/Footer';


export default function App() {

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {

    const unsubAuth = dispatch(listenAuth());
    return () => {
      unsubAuth && unsubAuth();
    }
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     <Loader/>
  //   );
  // }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen transition-colors duration-300">

        {user ? (
          <MainComponent />
        ) : (
          <AuthForm />
        )}
      </div>

      <Footer />
    </>
  );
}
