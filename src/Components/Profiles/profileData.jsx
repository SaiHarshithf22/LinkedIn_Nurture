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
    last_synced_at: "last_synced_at",
    is_scrape_posts: "is_scrape_posts",
    is_scrape_comments: "is_scrape_comments",
    is_scrape_reactions: "is_scrape_reactions",
    total_posts: "total_posts",
    total_reactions: "total_reactions",
    total_comments: "total_comments",
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
    if (res?.message) {
      showToast(res.message);
    } else {
      showToast("Please try again later", "error");
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
    minWidth: 200,
    sortable: true,
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
    minWidth: 200,
    flex: 1,
  },

  {
    field: "total_comments",
    headerName: "Total Comments",
    minWidth: 150,
    sortable: true,
    valueGetter: (params) => params?.data?.total_comments,
  },
  {
    field: "total_posts",
    headerName: "Total Posts",
    minWidth: 150,
    sortable: true,
    valueGetter: (params) => params?.data?.total_posts,
  },
  {
    field: "total_reactions",
    headerName: "Total Reactions",
    minWidth: 150,
    sortable: true,
    valueGetter: (params) => params?.data?.total_reactions,
  },
  {
    field: "is_scrape_posts",
    headerName: "Scrape Posts",
    minWidth: 150,
    sortable: true,
    cellRenderer: (params) => {
      const obj = {
        id: params?.data?.id,
        value: params?.data?.userProfile?.is_scrape_posts,
      };
      return <ProfileCheckbox name="is_scrape_posts" data={obj} />;
    },
  },
  {
    field: "is_scrape_comments",
    headerName: "Scrape Comments",
    minWidth: 175,
    sortable: true,
    cellRenderer: (params) => {
      const obj = {
        id: params?.data?.id,
        value: params?.data?.userProfile?.is_scrape_comments,
      };
      return <ProfileCheckbox name="is_scrape_comments" data={obj} />;
    },
  },
  {
    field: "is_scrape_reactions",
    headerName: "Scrape Reactions",
    minWidth: 150,
    sortable: true,
    cellRenderer: (params) => {
      const obj = {
        id: params?.data?.id,
        value: params?.data?.userProfile?.is_scrape_comments,
      };
      return <ProfileCheckbox name="is_scrape_reactions" data={obj} />;
    },
  },
  {
    field: "last_synced_at",
    headerName: "Last Synced",
    minWidth: 200,
    sortable: true,
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
