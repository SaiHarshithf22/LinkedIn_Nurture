import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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

export const FilterProfile = ({
  filterModal,
  setFilterModal,
  setProfileSelected,
}) => {
  const [query, setQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const getProfiles = async (searchQuery) => {
    const apiUrl = `${baseURL}/linkedin/profiles?query=${searchQuery}`;
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
      if (data?.profiles?.length) {
        setFilteredProfiles(data.profiles);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleFilterClose = () => {
    setFilterModal(false);
  };

  const handleSelectProfiles = () => {
    setProfileSelected(selectedProfiles);
    handleFilterClose();
  };

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    getProfiles(newQuery);
  };

  useEffect(() => {
    getProfiles("");
  }, []);

  return (
    <Dialog
      disableEscapeKeyDown
      open={filterModal}
      onClose={handleFilterClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Select Profiles</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          limitTags={3}
          options={filteredProfiles}
          value={selectedProfiles}
          onChange={(event, newValue) => {
            setSelectedProfiles(newValue);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) =>
            option?.name || option?.profile?.split("in/")?.[1]
          }
          renderOption={(props, option, { selected }) => {
            const { key, id, ...optionProps } = props;
            return (
              <li key={id} {...optionProps}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.name || option?.profile?.split("in/")?.[1]}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Profiles"
              variant="outlined"
              value={query}
              onChange={handleQueryChange}
              placeholder="Type to search profiles"
            />
          )}
          sx={{
            width: "100%",
            marginTop: 2,
          }}
          disableCloseOnSelect
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFilterClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSelectProfiles}
          color="primary"
          variant="contained"
        >
          Select Profiles
        </Button>
      </DialogActions>
    </Dialog>
  );
};
