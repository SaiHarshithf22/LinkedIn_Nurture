import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

import { UserPost } from "../UserPost/UserPost";
import { UserActivity } from "../UserActivity/UserActivity";
import Tabs from "../Tabs/Tabs";

export const UserProfile = () => {
  const [perPage, setPerPage] = useState(20);
  const gradientStyle = {
    width: "100%",
    height: "75px",
    background: "linear-gradient(270deg, #4B6CB7 0%, #182848 100%)",
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const position = queryParams.get("position");
  const profile = queryParams.get("profile");

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

  useEffect(() => {}, []);

  return (
    <div style={{ padding: "32px" }}>
      <div>
        <div
          style={{
            ...gradientStyle,
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        ></div>
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "26px",
              }}
            >
              <img src="/userLogo.png" height="110" width="110" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: "black",
                }}
              >
                <h3>{name}</h3>
                <p
                  title={position}
                  style={{
                    maxWidth: "400px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {position}
                </p>
              </div>
            </div>
            <button
              href="/"
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: "12px",
                backgroundColor: "#1976D2",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                window.open(profile, "_blank");
              }}
            >
              Open LinkedIn
            </button>
          </div>
        </div>
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            backgroundColor: "white",
            height: "max-content",
          }}
        >
          <Tabs tabs={tabData} />
        </div>
      </div>
    </div>
  );
};
