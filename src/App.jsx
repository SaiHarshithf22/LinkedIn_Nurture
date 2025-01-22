import { useState } from "react";
import { Activites } from "./Components/Activities/Activities";
import { Profile } from "./Components/Profiles/Profile";
import Tabs from "./Components/Tabs/Tabs";
import { Posts } from "./Components/Posts/Posts";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import "./App.css";
import { ToastProvider } from "./Components/Toaster/Toaster";
import { Route, Routes } from "react-router";
import { Home } from "./Components/Home/Home";

function App() {
  const [auth, setAuth] = useState(false);

  return (
    <ToastProvider>
      <Navbar setAuth={setAuth} auth={auth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
