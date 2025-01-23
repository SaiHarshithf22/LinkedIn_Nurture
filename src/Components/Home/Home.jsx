import { useNavigate } from "react-router";
import Tabs from "../Tabs/Tabs";
import { Profile } from "../Profiles/Profile";
import { Posts } from "../Posts/Posts";
import { Activites } from "../Activities/Activities";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const ProfileContext = createContext([]);

export const Home = () => {
  const [profilesSelected, setProfileSelected] = useState([]);
  const navigate = useNavigate();
  const tabData = [
    { label: "Profiles", content: <Profile /> },
    { label: "Posts", content: <Posts /> },
    { label: "Activities", content: <Activites /> },
  ];
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  return (
    <ProfileContext.Provider value={{ profilesSelected, setProfileSelected }}>
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Tabs tabs={tabData} />
      </div>
    </ProfileContext.Provider>
  );
};
