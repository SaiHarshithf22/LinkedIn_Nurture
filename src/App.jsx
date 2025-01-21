import { useState } from "react";
import { Activites } from "./Components/Activities/Activities";
import { Profile } from "./Components/Profiles/Profile";
import Tabs from "./Components/Tabs/Tabs";
import { Posts } from "./Components/Posts/Posts";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(false);
  const tabData = [
    { label: "Profiles", content: <Profile /> },
    { label: "Posts", content: <Posts /> },
    { label: "Activities", content: <Activites /> },
  ];

  return (
    <>
      <Navbar setAuth={setAuth} auth={auth} />
      {auth ? (
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tabs tabs={tabData} />
        </div>
      ) : (
        <Login setAuth={setAuth} />
      )}
    </>
  );
}

export default App;
