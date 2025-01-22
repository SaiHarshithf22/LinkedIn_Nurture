import { Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

export const CustomCheckbox = ({
  label,
  onCheckChange = () => {},
  name,
  checked,
  setChecked,
}) => {
  const handleChange = (event) => {
    onCheckChange();
    setChecked(event.target.checked);
  };
  return (
    <>
      {label ? (
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={label}
        />
      ) : (
        <Checkbox
          name={name}
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      )}
    </>
  );
};
