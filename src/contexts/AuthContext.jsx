import { createContext, useContext, useEffect, useState } from "react";
import {
  loginRequest,
  logoutRequest,
  passwordResetRequest,
  registerRequest,
  sendNewPasswordRequest,
} from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("user"));
    if (authUser) {
      setUser(authUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleUserUpdate = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutRequest();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (user) => {
    setLoading(true);
    try {
      const res = await registerRequest(user);
      handleUserUpdate(res.data.payload);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error.response.data);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (user) => {
    setLoading(true);
    try {
      const res = await loginRequest(user);
      handleUserUpdate(res.data.payload);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error.response.data);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      // const URL = "http://localhost:8080/api/auth/google";
      // const URL = "https://guardias-medicas-server-v2.vercel.app/api/auth/google";
      const URL =
        "https://guardias-medicas-server-v2-0.onrender.com/api/auth/google";
      window.location.href = URL;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const passwordReset = async (data) => {
    setLoading(true);
    try {
      const res = await passwordResetRequest(data);
      return res.data;
    } catch (error) {
      console.log(error?.response?.data);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const sendNewPassword = async (tid, data) => {
    setLoading(true);
    try {
      const res = await sendNewPasswordRequest(tid, data);
      return res.data;
    } catch (error) {
      console.log(error?.response?.data);
      setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errors?.error?.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signInGoogle,
        user,
        loading,
        isAuthenticated,
        errors,
        logout: handleLogout,
        passwordReset,
        sendNewPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
