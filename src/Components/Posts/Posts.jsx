import { useContext, useEffect, useRef, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import { ProfileContext } from "../Home/Home";
import { formatTimestamp } from "../../utils";

const columnDefs = [
  {
    field: "profile.name",
    headerName: "Name",
    width: 200,
    flex: 1,
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
    tooltipValueGetter: (params) =>
      params?.data?.text
        ? params?.data?.text
        : params?.value?.split("com/")?.[1],
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 200,
    flex: 1,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.timestamp),
  },
];

const baseURL = import.meta.env.VITE_BASE_URL;

export const Posts = () => {
  const { profilesSelected } = useContext(ProfileContext);
  const ids = profilesSelected?.map((profile) => profile.id);
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [perPage, setPerPage] = useState("20");
  const token = localStorage.getItem("authToken");
  const gridApi = useRef(null);

  const getPosts = async (params) => {
    const page = params?.page ? params?.page : 1;
    const limit = params?.perPage ? params?.perPage : perPage;
    const sortOrder = params?.sortOrder;
    const profileIds = params?.profileIds || [];

    // Construct the query string for profile IDs
    const profileIdsQuery = profileIds.length
      ? `&${profileIds.map((id) => `profile_ids[]=${id}`).join("&")}`
      : "";

    const apiUrl = `${baseURL}/linkedin/posts?page=${page}&limit=${limit}${
      sortOrder ? `&sort=${sortOrder}` : ""
    }${profileIdsQuery}`;

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
    // Get the current sort model before changing page
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    getPosts({ page: value, sortOrder: sortModel, profileIds: ids });
  };

  const handlePerPageChange = (value) => {
    // Get the current sort model before changing page size
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    setPerPage(value);
    getPosts({ perPage: value, sortOrder: sortModel, profileIds: ids });
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    if (sortModel?.sort) {
      getPosts({ sortOrder: sortModel.sort, profileIds: ids });
    } else {
      getPosts({ profileIds: ids });
    }
  };

  useEffect(() => {
    if (profilesSelected?.length > 0) {
      getPosts({ profileIds: ids });
    } else {
      getPosts();
    }
  }, [profilesSelected]);

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
        rowData={data?.posts}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
        onSortChanged={onSortChanged}
        onGridReady={onGridReady}
      />
      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPageChange={onPageChange}
        onPerPageChange={handlePerPageChange}
        perPage={perPage}
      />
    </div>
  );
};
