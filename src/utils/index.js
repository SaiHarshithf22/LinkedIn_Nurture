import { jwtDecode } from "jwt-decode";

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const isDeepEqual = (obj1, obj2) => {
  // Check if both are objects and not null
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2; // Compare primitive values directly
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if number of keys is different
  if (keys1.length !== keys2.length) return false;

  // Check each key and value recursively
  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const syncProfile = async (id) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("authToken");
  const apiUrl = `${baseURL}/linkedin/profiles/${id}/sync`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response?.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const res = await response.json();
      return {
        message: res.message,
      };
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return false;
  }
};

export const isTokenExpired = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return true; // If no token, treat it as expired

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime;
  } catch (error) {
    return true; // Token is invalid or can't be decoded
  }
};
