import React, { useState } from "react";
import * as Papa from "papaparse";
import { Card, IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useEffect } from "react";
import { useToast } from "../Toaster/Toaster";
import Modal from "../Modal/Modal";
import { useRef } from "react";
import ProfileImportErrors, {
  ProfileImportLoader,
} from "../ProfileImportError/ProfileImportError";

const baseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");

const parseBooleanValue = (value) => {
  if (typeof value === "string") {
    const lowercaseValue = value.toLowerCase().trim();
    if (lowercaseValue === "true") return true;
    if (lowercaseValue === "false") return false;
    if (lowercaseValue === "1") return true;
    if (lowercaseValue === "0") return false;
  }
  return value;
};

const CSVUploader = () => {
  const [csvData, setCSVData] = useState([]);
  const [error, setError] = useState([]);
  const showToast = useToast();
  const addProfileRef = useRef();

  const handleModalClose = () => {
    setError([]);
    setCSVData([]);
    addProfileRef?.current?.close();
  };

  const addProfiles = async (profiles) => {
    addProfileRef?.current?.showModal();
    const apiUrl = `${baseURL}/linkedin/profiles`;
    let successCount = 0;
    let errorProfiles = [];

    const uploadPromises = profiles.map(async (profileData) => {
      const requestBody = {
        profile: profileData.urls,
        is_scrape_posts: profileData.posts,
        is_scrape_comments: profileData.comments,
        is_scrape_reactions: profileData.reactions,
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
          const errorRes = await response.json();
          showToast(
            `Error adding ${profileData.urls}: ${errorRes?.error}`,
            "error"
          );
          errorProfiles.push({
            url: profileData.urls,
            error: errorRes?.error,
          });
          return false;
        }

        successCount++;
        return true;
      } catch (error) {
        showToast(`Network error for ${profileData.urls}`, "error");
        errorProfiles.push({
          url: profileData.urls,
          error: error.message,
        });
        return false;
      }
    });

    await Promise.all(uploadPromises);

    if (errorProfiles.length > 0) {
      console.error("Profiles with errors:", errorProfiles);
      setError(errorProfiles);
    }
    showToast(`Successfully added ${successCount} profiles`, "success");

    if (errorProfiles?.length === 0) {
      handleModalClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Parse headers and data to convert boolean strings
        const parsedData = results.data.map((row) =>
          Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key,
              parseBooleanValue(value),
            ])
          )
        );

        const cleanedData = parsedData.filter((row) =>
          Object.values(row).some((val) => val !== "")
        );

        setCSVData(cleanedData);
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
      },
    });
  };

  useEffect(() => {
    if (csvData?.length > 0) {
      addProfiles(csvData);
    }
  }, [csvData]);

  return (
    <Card>
      <input
        accept=".csv"
        style={{ display: "none" }}
        id="csv-upload-button"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="csv-upload-button">
        <IconButton
          color="primary"
          aria-label="upload CSV"
          component="span"
          sx={{
            fontSize: 16,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FileUploadIcon fontSize="inherit" />
        </IconButton>
      </label>
      <Modal
        modalRef={addProfileRef}
        title={""}
        content={
          <div>
            {error?.length > 0 ? (
              <ProfileImportErrors errors={error} />
            ) : (
              <ProfileImportLoader totalProfiles={csvData?.length} />
            )}
            <button
              style={{
                marginTop: "20px",
                backgroundColor: "gray",
                color: "white",
              }}
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        }
      />
    </Card>
  );
};

export default CSVUploader;
