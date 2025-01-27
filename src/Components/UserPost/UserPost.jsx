import { useEffect, useRef, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import { formatTimestamp } from "../../utils";

const token = localStorage.getItem("authToken");

const baseURL = import.meta.env.VITE_BASE_URL;

const postColumnDefs = [
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
    tooltipValueGetter: (params) =>
      params?.data?.text
        ? params?.data?.text
        : params?.value?.split("com/")?.[1],
  },
  {
    field: "timestamp",
    headerName: "Post created at",
    width: 200,
    flex: 1,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.timestamp),
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    width: 200,
    flex: 1,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

export const UserPost = ({ id, perPage, setPerPage }) => {
  const [postsData, setPostsData] = useState([]);
  const gridApi = useRef(null);

  const getPosts = async (params) => {
    const page = params?.page ? params?.page : 1;
    const limit = params?.perPage ? params?.perPage : perPage;
    const sortOrder = params?.sortOrder;
    const sortBy = params?.sortBy;
    const profileId = params?.profileId;

    const apiUrl = `${baseURL}/linkedin/posts?page=${page}&limit=${limit}${
      sortOrder ? `&sort=${sortOrder}&sort_by=${sortBy}` : ""
    }&profile_ids=${profileId}`;

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
        setPostsData(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
    }
  };

  const handlePerPageChange = (value) => {
    // Get the current sort model before changing page size
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);
    const sortBy =
      sortModel?.colId === "createdAt"
        ? "created_at"
        : sortModel?.colId === "timestamp"
        ? "timestamp"
        : "";
    setPerPage(value);
    getPosts({
      perPage: value,
      sortOrder: sortModel?.sort,
      profileId: id,
      sortBy: sortBy,
    });
  };

  const onPostsPageChange = (event, value) => {
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);

    const sortBy =
      sortModel?.colId === "createdAt"
        ? "created_at"
        : sortModel?.colId === "timestamp"
        ? "timestamp"
        : "";
    getPosts({
      page: value,
      sortOrder: sortModel?.sort,
      profileId: id,
      sortBy: sortBy,
    });
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    const sortBy =
      sortModel?.colId === "createdAt"
        ? "created_at"
        : sortModel?.colId === "timestamp"
        ? "timestamp"
        : "";
    if (sortModel?.sort) {
      getPosts({
        sortOrder: sortModel.sort,
        profileId: id,
        sortBy: sortBy,
      });
    } else {
      getPosts({ profileId: id });
    }
  };

  useEffect(() => {
    if (id) {
      getPosts({ profileId: id });
    }
  }, [id]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#00165a" }}>Posts</h2>
      </div>
      <TableComponent
        rowData={postsData?.posts}
        columnDefs={postColumnDefs}
        onSortChanged={onSortChanged}
        onGridReady={onGridReady}
      />
      <CustomPagination
        totalPages={postsData?.pagination?.total_pages}
        currentPage={postsData?.pagination?.current_page}
        onPageChange={onPostsPageChange}
        onPerPageChange={handlePerPageChange}
        perPage={perPage}
      />
    </div>
  );
};
