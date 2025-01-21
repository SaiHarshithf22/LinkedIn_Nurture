import { useRef, useState, useEffect } from "react";
import TableComponent from "../Table/Table";
import Modal from "../Modal/Modal";
import { profiles } from "../../../constants/profiles";
import { CheckBox } from "@mui/icons-material";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import { ProfileCheckbox } from "../ProfileCheckbox/ProfileCheckbox";

const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <a href={params.data.url} target="_blank" rel="noopener noreferrer">
          {params.data.name}
        </a>
      );
    },
  },
  {
    field: "position",
    headerName: "Position",
    width: 200,
    flex: 1,
  },
];

const baseURL = import.meta.env.VITE_BASE_URL;

const ModalContent = ({ modalRef }) => {
  const [profileUrl, setProfileUrl] = useState("");
  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const addNewProfile = async () => {
    setProfileUrl("");
    const apiUrl = `${baseURL}/profiles`;

    const requestBody = {
      profiles: [profileUrl],
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

      console.log("Profiles posted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error posting profiles:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNewProfile();
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 32px",
        gap: "16px",
      }}
    >
      <input
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        type="text"
        name="url"
        placeholder="Add Profile URL"
        style={{ padding: "8px", fontSize: "18px" }}
      />
      <CustomCheckbox label="Scrape Posts" initialValue={true} />
      <CustomCheckbox label="Scrape Comments" initialValue={true} />
      <CustomCheckbox label="Scrape Reactions" initialValue={true} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <button
          type="submit"
          style={buttonStyle}
          onClick={() => {
            modalRef.current?.showModal();
          }}
        >
          Add Profile
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
          }}
          onClick={() => {
            modalRef.current.close();
          }}
        >
          Close
        </button>
      </div>
    </form>
  );
};

export const Profile = () => {
  const [profileData, setProfileData] = useState(profiles);
  const modalRef = useRef(null);

  const getProfiles = async () => {
    const apiUrl = `${baseURL}/profiles`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setProfileData(data?.profiles);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      return null;
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Profiles</h2>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            modalRef.current?.showModal();
          }}
        >
          New Profile
        </button>
      </div>
      <TableComponent
        rowData={profileData}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />
      <Modal
        modalRef={modalRef}
        title={"Add New Profile"}
        content={<ModalContent modalRef={modalRef} />}
      />
    </div>
  );
};
