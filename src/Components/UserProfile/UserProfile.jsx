import { useState } from "react";
import { useLocation, useParams } from "react-router";

import { UserPost } from "../UserPost/UserPost";
import { UserActivity } from "../UserActivity/UserActivity";
import Tabs from "../Tabs/Tabs";
import { Gradient } from "../Gradient/Gradient";
import { LinkedIn } from "@mui/icons-material";
import { syncProfile } from "../../utils";
import { useToast } from "../Toaster/Toaster";

export const UserProfile = () => {
  const [perPage, setPerPage] = useState(20);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const position = queryParams.get("position");
  const profile = queryParams.get("profile");
  const showToast = useToast();

  const { id } = useParams();

  const tabData = [
    {
      label: "Posts",
      content: <UserPost id={id} setPerPage={setPerPage} perPage={perPage} />,
    },
    {
      label: "Activities",
      content: (
        <UserActivity id={id} setPerPage={setPerPage} perPage={perPage} />
      ),
    },
  ];

  const syncProfileCall = async () => {
    const res = await syncProfile(id);
    if (res?.message) {
      showToast(res.message);
    } else {
      showToast("Please try again later", "error");
    }
  };

  return (
    <div className="home-wrapper">
      <div style={{ backgroundColor: "white" }}>
        <Gradient />
        <div style={{ padding: "24px" }}>
          <div className="profile-info">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "26px",
              }}
            >
              <img src="/userLogo.png" className="user-img" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: "black",
                }}
              >
                <h3>{name}</h3>
                <p title={position} className="profile-position">
                  {position}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  color: "#1976D2",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open(profile, "_blank");
                }}
              >
                <LinkedIn fontSize="large" />
              </div>
              <button
                href="/"
                style={{
                  display: "flex",
                  padding: "6px 22px",
                  borderRadius: "12px",
                  backgroundColor: "#1976D2",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={syncProfileCall}
              >
                Sync Profile
              </button>
            </div>
          </div>
        </div>
        <div className="profile-tab-wrapper">
          <Tabs tabs={tabData} />
        </div>
      </div>
    </div>
  );
};
