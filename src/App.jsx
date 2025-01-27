import { useEffect } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import { ToastProvider } from "./Components/Toaster/Toaster";
import { Route, Routes, useNavigate } from "react-router";
import { Home } from "./Components/Home/Home";
import "./App.css";

function App() {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [token]);

  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
