import * as React from "react";
import PropTypes from "prop-types";
import { Input as BaseInput } from "@mui/material";
import { Box, styled } from "@mui/system";

// Styled version of Material UI Input
const StyledInput = styled(BaseInput)({
  "& .MuiInput-input": {
    width: "40px",
    height: "40px",
    padding: "0",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "1.2rem",
    margin: "0 4px",
    "&:focus": {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
      outline: "none",
    },
    "&:hover": {
      borderColor: "#2196f3",
    },
  },
  // Remove the default underline
  "&::before": {
    display: "none",
  },
  "&::after": {
    display: "none",
  },
  // Remove default hover/focus effects
  "&:hover:not(.Mui-disabled):before": {
    display: "none",
  },
  "&.Mui-focused:after": {
    display: "none",
  },
});

function OTP({ separator, length, value, onChange }) {
  const inputRefs = React.useRef(
    [...Array(length)]?.map(() => React.createRef())
  );

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex]?.current;
    if (targetInput) {
      targetInput.focus();
    }
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex]?.current;
    if (targetInput) {
      targetInput.select();
    }
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      const input = inputRefs.current[indexToEnter]?.current;
      if (input?.value && indexToEnter < currentIndex) {
        indexToEnter += 1;
      } else {
        break;
      }
    }

    onChange((prev) => {
      const otpArray = prev.split("");
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join("");
    });

    if (currentValue !== "") {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData.types.includes("text/plain")) {
      let pastedText = clipboardData.getData("text/plain");
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        const input = inputRefs.current[indexToEnter]?.current;
        if (input?.value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split("");

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? " ";
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(""));
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[...Array(length)].map((_, index) => (
        <React.Fragment key={index}>
          <StyledInput
            inputRef={inputRefs.current[index]}
            inputProps={{
              onKeyDown: (event) => handleKeyDown(event, index),
              onChange: (event) => handleChange(event, index),
              onClick: (event) => handleClick(event, index),
              onPaste: (event) => handlePaste(event, index),
              maxLength: 1,
            }}
            value={value[index] ?? ""}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};

export default function OTPInput({ otp, setOtp }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <OTP separator={<span></span>} value={otp} onChange={setOtp} length={4} />
    </Box>
  );
}
