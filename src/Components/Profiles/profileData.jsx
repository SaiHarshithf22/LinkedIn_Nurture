import { ProfileCheckbox } from "../ProfileCheckbox/ProfileCheckbox";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { formatTimestamp, syncProfile } from "../../utils";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useToast } from "../Toaster/Toaster";

const options = ["Sync", "Delete"];

const baseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");

export const profileFilterKeys = (colId) => {
  const sortMap = {
    name: "name",
    last_synced_at: "created_at",
    is_scrape_posts: "is_scrape_posts",
    is_scrape_comments: "is_scrape_comments",
    is_scrape_reactions: "is_scrape_reactions",
  };
  return sortMap[colId] || "";
};

const ActionsMenu = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const showToast = useToast();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const syncProfileCall = async () => {
    const res = await syncProfile(id);
    if (res) {
      showToast("Sync started successfully");
    }
  };

  const deleteProfile = async () => {
    const apiUrl = `${baseURL}/linkedin/profiles/${id}/status`;
    const requestBody = {
      status: "inactive",
    };
    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      if (data?.id) {
        showToast("Profile deleted");
        // window.location.reload();
      }
    } catch (error) {
      showToast("Error deleting profile", "error");
      console.error("Error deleting profiles:", error);
      return null;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionsClick = (option) => {
    if (option?.toLowerCase() === "sync") {
      syncProfileCall();
    } else if (option?.toLowerCase() === "delete") {
      deleteProfile();
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={() => {
              handleOptionsClick(option);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    width: 200,

    cellRenderer: (params) => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <a
            style={{ display: "flex" }}
            href={params.data.profile}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
          <a
            style={{ color: "black" }}
            href={`profile/${params.data.id}?name=${params?.data?.name}&profile=${params?.data?.profile}&position=${params?.data?.position}`}
            rel="noopener noreferrer"
          >
            {params.data.name || params?.data?.profile?.split("in/")?.[1]}
          </a>
        </div>
      );
    },
  },
  {
    field: "position",
    headerName: "Position",
    width: 200,
  },

  {
    field: "total_comments",
    headerName: "Total Comments",
    width: 150,
  },
  {
    field: "total_posts",
    headerName: "Total Posts",
    width: 150,
  },
  {
    field: "total_reactions",
    headerName: "Total Reactions",
    width: 150,
  },
  {
    field: "is_scrape_posts",
    headerName: "Scrape Posts",
    width: 150,

    cellRenderer: (params) => {
      const obj = {
        value: params?.data?.user_profile?.is_scrape_posts,
      };
      return <ProfileCheckbox name="is_scrape_posts" data={obj} />;
    },
  },
  {
    field: "is_scrape_comments",
    headerName: "Scrape Comments",
    width: 175,

    cellRenderer: (params) => {
      const obj = {
        value: params?.data?.user_profile?.is_scrape_comments,
      };
      return <ProfileCheckbox name="is_scrape_comments" data={obj} />;
    },
  },
  {
    field: "is_scrape_reactions",
    headerName: "Scrape Reactions",
    width: 150,

    cellRenderer: (params) => {
      const obj = {
        value: params?.data?.user_profile?.is_scrape_comments,
      };
      return <ProfileCheckbox name="is_scrape_reactions" data={obj} />;
    },
  },
  {
    field: "last_synced_at",
    headerName: "Last Synced",
    width: 200,

    valueGetter: (params) => {
      if (params.data.last_synced_at) {
        return formatTimestamp(params.data.last_synced_at);
      }
      return "";
    },
    tooltipValueGetter: (params) => {
      if (params.data.last_synced_at) {
        return formatTimestamp(params.data.last_synced_at);
      }
      return "";
    },
  },

  {
    field: "id",
    headerName: "",
    width: 75,
    cellRenderer: (params) => <ActionsMenu id={params?.value} />,
  },
];
