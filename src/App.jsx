import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import { ToastProvider } from "./Components/Toaster/Toaster";
import { Home } from "./Components/Home/Home";
import "./App.css";
import { UserProfile } from "./Components/UserProfile/UserProfile";
import { isTokenExpired } from "./utils";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token || isTokenExpired()) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, []);

  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
