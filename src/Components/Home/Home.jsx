import { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router";
import Tabs from "../Tabs/Tabs";
import { Profile } from "../Profiles/Profile";
import { Posts } from "../Posts/Posts";
import { Activites } from "../Activities/Activities";
import { Gradient } from "../Gradient/Gradient";

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
      <div className="home-wrapper">
        <div style={{ backgroundColor: "white" }}>
          <Gradient />
          <div className="home-tab-wrapper">
            <Tabs tabs={tabData} />
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};
