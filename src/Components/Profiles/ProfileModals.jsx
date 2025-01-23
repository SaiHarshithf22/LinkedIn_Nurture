import { useState } from "react";
import { useToast } from "../Toaster/Toaster";
import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";

const baseURL = import.meta.env.VITE_BASE_URL;

export const buttonStyle = {
  padding: "5px 10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const token = localStorage.getItem("authToken");

export const FilterProfile = ({ modalRef, setProfileSelected }) => {
  const [query, setQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const getProfiles = async (query) => {
    const apiUrl = `${baseURL}/linkedin/profiles?query=${query}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setFilteredProfiles(data?.profiles);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      return null;
    }
  };

  const handleFilterClose = () => {
    modalRef.current.close();
  };

  const handleSelectProfiles = () => {
    setProfileSelected(selectedProfiles);
    handleFilterClose();
  };

  const handleQuery = (e) => {
    setQuery(e.target.value);
    getProfiles(e.target.value);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "250px",
        color: "black",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",

          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Autocomplete
          multiple
          disablePortal
          limitTags={2}
          options={filteredProfiles}
          value={selectedProfiles}
          onChange={(event, newValue) => {
            setSelectedProfiles(newValue);
          }}
          slotProps={{
            popper: {
              sx: {
                zIndex: (theme) => {
                  return theme.zIndex.modal + 100;
                },
              },
            },
          }}
          sx={{
            width: 550,
            margin: "auto",
          }}
          disableCloseOnSelect
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.name}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              value={query}
              onChange={handleQuery}
              {...params}
              label="Search name"
            />
          )}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          paddingTop: "12px",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          type="submit"
          style={buttonStyle}
          onClick={handleSelectProfiles}
        >
          Select Profiles
        </button>
        <button
          type="button"
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
          }}
          onClick={handleFilterClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
