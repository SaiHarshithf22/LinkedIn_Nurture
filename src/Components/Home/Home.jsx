import { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router";
import Tabs from "../Tabs/Tabs";
import { Profile } from "../Profiles/Profile";
import { Posts } from "../Posts/Posts";
import { Activites } from "../Activities/Activities";

export const ProfileContext = createContext([]);

export const Home = () => {
  const [profilesSelected, setProfileSelected] = useState([]);
  const [perPage, setPerPage] = useState("20");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [token]);

  const tabData = [
    {
      label: "Profiles",
      content: <Profile setPerPage={setPerPage} perPage={perPage} />,
    },
    {
      label: "Posts",
      content: <Posts setPerPage={setPerPage} perPage={perPage} />,
    },
    {
      label: "Activities",
      content: <Activites setPerPage={setPerPage} perPage={perPage} />,
    },
  ];

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
