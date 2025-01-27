import { useState } from "react";
import { Pagination } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const CustomPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  onPerPageChange,
  perPage,
}) => {
  const handleChange = (event) => {
    onPerPageChange(event.target.value);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {perPage && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#000" }}>Rows Per Page</span>
          <FormControl>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Number(perPage)}
              onChange={handleChange}
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={60}>60</MenuItem>
              <MenuItem value={80}>80</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      <Pagination
        color="primary"
        count={Number(totalPages)}
        page={Number(currentPage)}
        onChange={onPageChange}
        hideNextButton
        hidePrevButton
      />
    </div>
  );
};
