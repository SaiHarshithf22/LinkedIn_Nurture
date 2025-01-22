import { useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = [
  {
    field: "profile.name",
    headerName: "Name",
    width: 200,
    flex: 1,
    filter: "agTextColumnFilter",
    cellRenderer: (params) => (
      <a
        href={params.data.profile.profile}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.data.profile.name}
      </a>
    ),
  },
  {
    field: "url",
    headerName: "Post",
    flex: 2,
    cellRenderer: (params) => {
      return (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params?.data?.text
            ? params?.data?.text
            : params?.value?.split("com/")?.[1]}
        </a>
      );
    },
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 200,
    flex: 1,
    valueGetter: (params) => new Date(params.data.timestamp).toLocaleString(), // Format timestamp
  },
];

export const Posts = () => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const token = localStorage.getItem("authToken");

  const getPosts = async (page) => {
    const apiUrl = `${baseURL}/linkedin/posts?page=${page ? page : 1}`;

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
      console.error("Error fetching posts:", error);
      return null;
    }
  };

  const onPageChange = (event, value) => {
    getPosts(value);
  };

  useEffect(() => {
    getPosts();
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
        <h2>Posts</h2>
      </div>
      <TableComponent
        rowData={data?.posts}
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
