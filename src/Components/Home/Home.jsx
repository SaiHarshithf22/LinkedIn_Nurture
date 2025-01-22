import { useNavigate } from "react-router";
import Tabs from "../Tabs/Tabs";
import { Profile } from "../Profiles/Profile";
import { Posts } from "../Posts/Posts";
import { Activites } from "../Activities/Activities";
import { useEffect } from "react";

export const Home = () => {
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
  );
};
