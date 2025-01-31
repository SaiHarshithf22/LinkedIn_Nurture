import { useState } from "react";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import { useToast } from "../Toaster/Toaster";

const baseURL = import.meta.env.VITE_BASE_URL;

export const ProfileCheckbox = ({ data, name }) => {
  const token = localStorage.getItem("authToken");
  const [checked, setChecked] = useState(data?.value);
  const showToast = useToast();

  const updateProfile = async (value) => {
    const apiUrl = `${baseURL}/linkedin/profiles/${data?.id}`;

    const requestBody = {
      [name]: value,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      if (data?.id) {
        showToast("Profile Updated");
      }
    } catch (error) {
      showToast("Error updating profile", "error");
      console.error("Error update profiles:", error);
      return null;
    }
  };

  return (
    <CustomCheckbox
      checked={checked}
      setChecked={setChecked}
      name={name}
      onCheckChange={updateProfile}
    />
  );
};
