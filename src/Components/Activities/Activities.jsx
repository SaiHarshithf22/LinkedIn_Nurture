import { useEffect, useState } from "react";
import { activities } from "../../../constants/activities";
import ProfileRenderer from "../ProfileRenderer/ProfileRenderer";
import TableComponent from "../Table/Table";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = [
  {
    filter: "agTextColumnFilter",
    field: "profile",
    headerName: "Profile",
    valueGetter: (params) => params.data.profile.name,
    cellRenderer: (params) => (
      <a
        href={params.data.profile.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.data.profile.name}
      </a>
    ),
    width: 200,
    flex: 1,
  },
  {
    field: "activity_type",
    headerName: "Activity Type",
    filter: "agTextColumnFilter",
    flex: 1,
  },
  {
    flex: 1,
    field: "post_url",
    headerName: "Post URL",
    cellRenderer: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View Post
      </a>
    ),
  },
  {
    flex: 1,
    field: "post_author_linkedin_url",
    headerName: "Author Profile",
    cellRenderer: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View Profile
      </a>
    ),
  },
  { flex: 1, field: "user_comment", headerName: "User Comment", width: 300 },
  {
    flex: 1,
    field: "commenter_comment",
    headerName: "Commenter Comment",
    width: 300,
  },
];

export const Activites = () => {
  const [activityData, setActivityData] = useState(activities);

  const getActivities = async () => {
    const apiUrl = `${baseURL}/activities`;

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
        setActivityData(data?.activities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  useEffect(() => {
    getActivities();
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
        <h2>Activities</h2>
      </div>
      <TableComponent
        rowData={activityData}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />
    </div>
  );
};
