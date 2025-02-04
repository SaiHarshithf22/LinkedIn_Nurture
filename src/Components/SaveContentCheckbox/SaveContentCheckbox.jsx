import { useState } from "react";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import { useToast } from "../Toaster/Toaster";

const baseURL = import.meta.env.VITE_BASE_URL;

export const SaveContentCheckbox = ({ data, name }) => {
  const token = localStorage.getItem("authToken");
  const [checked, setChecked] = useState(data?.value);
  const showToast = useToast();

  const toggleSave = async (value) => {
    const apiUrl = `${baseURL}/linkedin/saved`;

    const requestBody = {
      resource_id: data?.id,
      resource_type: data?.type,
      operation: value ? "save" : "unsave",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const output = await response.json(); // Parse the JSON response
      showToast(output?.message);
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
      onCheckChange={toggleSave}
    />
  );
};
