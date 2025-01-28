import { FilterAlt } from "@mui/icons-material";

const outlineStyles = {
  padding: "9px 22px",
  backgroundColor: "white",
  color: "black",
  border: "1px solid #0000004D",
  borderRadius: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "16px",
};

export const FilterButton = ({ handleFilter, isClear }) => {
  return (
    <button style={outlineStyles} onClick={handleFilter}>
      <FilterAlt fontSize="16" /> {isClear ? "Clear" : ""} Filter
    </button>
  );
};

export const FilledButton = ({ children, onClick, type }) => {
  return (
    <button
      type={type}
      style={{
        padding: "9px 22px",
        backgroundColor: "#1976D2",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const OutlineButton = ({ onClick, children, type }) => {
  return (
    <button type={type} style={outlineStyles} onClick={onClick}>
      {children}
    </button>
  );
};
