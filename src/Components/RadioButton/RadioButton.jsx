import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RadioButtons({
  label,
  options,
  defaultValue,
  onChange,
  value,
  setValue,
}) {
  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={defaultValue}
        name="radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {options?.map((option) => (
          <FormControlLabel
            value={option?.value}
            control={<Radio size="small" />}
            label={option?.label}
            key={option?.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
