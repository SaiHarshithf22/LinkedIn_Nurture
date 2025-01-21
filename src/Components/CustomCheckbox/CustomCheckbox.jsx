import { Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

export const CustomCheckbox = ({
  initialValue = false,
  label,
  onCheckChange = () => {},
  name,
}) => {
  const [checked, setChecked] = useState(initialValue);

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
