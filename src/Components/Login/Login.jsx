import { useState } from "react";
import { Button, TextField } from "@mui/material";
import OTPInput from "../OTPInput/OTPInput";
import { useToast } from "../Toaster/Toaster";
import { useNavigate } from "react-router";

const baseURL = import.meta.env.VITE_BASE_URL;

export const Login = () => {
  const [otp, setOtp] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const showToast = useToast();

  const getOtp = async () => {
    const apiUrl = `${baseURL}/linkedin/users/otp`;
    const requestBody = {
      email: email,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIsOtpGenerated(true);
      showToast(data?.message, "success");
    } catch (error) {
      console.error("Error getting OTP", error);
      showToast("Error getting OTP", "error");
      return null;
    }
  };

  const verifyOtp = async () => {
    const apiUrl = `${baseURL}/linkedin/users/otp/verify`;
    const requestBody = {
      email: email,
      otp: otp,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      if (data.token) {
        navigate("/");
      }
      showToast(data?.message, "success");
    } catch (error) {
      console.error("Error getting OTP", error);
      showToast("Error getting OTP", "error");
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
      <h2 style={{ color: "black" }}>Login/Signup</h2>
      <div
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          label="Enter your email"
          type="email"
          required
          fullWidth
        />
        {isOtpGenerated ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <OTPInput otp={otp} setOtp={setOtp} />
            <Button fullWidth variant="contained" onClick={verifyOtp}>
              Login
            </Button>
          </div>
        ) : (
          <Button fullWidth variant="outlined" onClick={getOtp}>
            Get OTP
          </Button>
        )}
      </div>
    </div>
  );
};
