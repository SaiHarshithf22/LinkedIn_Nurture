import { useState, useEffect } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

export const NameFilter = ({ selectedProfiles, setSelectedProfiles }) => {
  const [query, setQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const token = localStorage.getItem("authToken");
  const baseURL = import.meta.env.VITE_BASE_URL;

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

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    getProfiles(newQuery);
  };

  useEffect(() => {
    getProfiles("");
  }, []);
  return (
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
  );
};
