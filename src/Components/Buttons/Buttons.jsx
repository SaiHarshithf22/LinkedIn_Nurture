import { FilterAlt } from "@mui/icons-material";

const outlineStyles = {
  backgroundColor: "white",
  color: "black",
  border: "1px solid #0000004D",
};

export const FilterButton = ({ handleFilter, isClear }) => {
  return (
    <button
      className="custom-button"
      style={outlineStyles}
      onClick={handleFilter}
    >
      <FilterAlt fontSize="16" /> {isClear ? "Clear" : ""} Filter
    </button>
  );
};

export const FilledButton = ({ children, onClick, type }) => {
  return (
    <button
      className="custom-button"
      type={type}
      style={{
        backgroundColor: "#1976D2",
        color: "white",
        border: "none",
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
    <button
      className="custom-button"
      type={type}
      style={outlineStyles}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
