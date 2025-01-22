import { Pagination } from "@mui/material";
import React from "react";

export const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
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
