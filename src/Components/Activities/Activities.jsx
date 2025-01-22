import { useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = [
  {
    filter: "agTextColumnFilter",
    field: "profile",
    headerName: "Profile",
    valueGetter: (params) => params.data.profile.name,
    cellRenderer: (params) => {
      return (
        <a
          href={params.data.profile.profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.data.profile.name}
        </a>
      );
    },
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
    flex: 2,
    field: "url",
    headerName: "Post",
    cellRenderer: (params) => {
      return (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params?.data?.post_content}
        </a>
      );
    },
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
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const token = localStorage.getItem("authToken");

  const getActivities = async (page) => {
    const apiUrl = `${baseURL}/linkedin/activities?page=${page ? page : 1}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const onPageChange = (event, value) => {
    getActivities(value);
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
        rowData={data?.activities}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />
      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPageChange={onPageChange}
      />
    </div>
  );
};
