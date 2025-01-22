import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
