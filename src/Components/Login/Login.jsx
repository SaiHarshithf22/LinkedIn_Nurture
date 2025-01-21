import { useState } from "react";
import { Button, Input, TextField } from "@mui/material";
import OTPInput from "../OTPInput/OTPInput";

const baseURL = import.meta.env.VITE_BASE_URL;

export const Login = ({ setAuth }) => {
  const [otp, setOtp] = useState(false);

  const getOtp = async () => {
    const apiUrl = `${baseURL}/login/otp`;

    const requestBody = {
      email: "",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the request body is JSON
        },
        body: JSON.stringify(requestBody), // Convert the body to a JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON response
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error getting OTP", error);
      return null;
    }
  };
  return (
    <div
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        height: "60vh",
        justifyContent: "center",
      }}
    >
      <h2>Login/Signup</h2>
      <form
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <TextField label="Enter your email" type="email" required fullWidth />
        {otp ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <OTPInput value={otp} onChange={setOtp} />
            <Button fullWidth variant="contained" onClick={() => setAuth(true)}>
              Login
            </Button>
          </div>
        ) : (
          <Button fullWidth variant="outlined" onClick={() => setOtp(true)}>
            Get OTP
          </Button>
        )}
      </form>
    </div>
  );
};
