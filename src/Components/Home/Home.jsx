import Tabs from "../Tabs/Tabs";
import { Profile } from "../Profiles/Profile";
import { Posts } from "../Posts/Posts";
import { Activites } from "../Activities/Activities";

import { useState } from "react";
import { createContext } from "react";

export const ProfileContext = createContext([]);

export const Home = () => {
  const [profilesSelected, setProfileSelected] = useState([]);
  const [perPage, setPerPage] = useState("20");

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
