import { useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { tempPosts } from "../../../constants/posts";

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
        href={params.data.profile.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.data.profile.name}
      </a>
    ),
  },
  {
    field: "post",
    headerName: "Post URL",
    flex: 1,
    cellRenderer: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View Post
      </a>
    ),
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
  const [postsData, setPostData] = useState(tempPosts);

  const getPosts = async () => {
    const apiUrl = `${baseURL}/posts`;

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
        setPostData(data?.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
    }
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
        rowData={postsData}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />
    </div>
  );
};
