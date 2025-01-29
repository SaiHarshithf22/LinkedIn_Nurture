import { useEffect, useRef, useState } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import { formatTimestamp, isDeepEqual } from "../../utils";
import { PostsFilter } from "../Filters/PostsFilter";
import { FilterButton } from "../Buttons/Buttons";

const columnDefs = [
  {
    field: "profile.name",
    headerName: "Name",
    width: 300,
    cellRenderer: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <a
          style={{ display: "flex" }}
          href={params.data.profile.profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
        <a
          style={{ color: "black" }}
          href={`profile/${params.data?.profile?.id}?name=${params?.data?.profile?.name}&profile=${params?.data?.profile?.profile}&position=${params?.data?.profile?.position}`}
          rel="noopener noreferrer"
        >
          {params.data.profile.name}
        </a>
      </div>
    ),
  },
  {
    field: "url",
    headerName: "Post",
    width: 400,
    cellRenderer: (params) => {
      return (
        <a
          style={{ color: "#0056b3" }}
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
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
    width: 300,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.timestamp),
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    width: 285,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

const baseURL = import.meta.env.VITE_BASE_URL;

const initialFilters = {
  profiles: [],
  timestampEnd: "",
  timestampStart: "",
  createdAtEnd: "",
  createdAtStart: "",
};

export const Posts = ({ perPage, setPerPage }) => {
  const [filterModal, setFilterModal] = useState(false);
  const [filterTypes, setFilterTypes] = useState(initialFilters);
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });

  const token = localStorage.getItem("authToken");
  const gridApi = useRef(null);

  const getPosts = async (params) => {
    const ids = params?.profiles?.map((profile) => profile.id);
    const page = params?.page ? params?.page : 1;
    const limit = params?.perPage ? params?.perPage : perPage;
    const sortOrder = params?.sortOrder;
    const sortBy = params?.sortBy;
    const profileIds = ids || [];
    const timestampStart = params?.timestampStart;
    const timestampEnd = params?.timestampEnd;
    const createdAtStart = params?.createdAtStart;
    const createdAtEnd = params?.createdAtEnd;

    // Construct the query string for profile IDs
    const profileIdsQuery = profileIds.length
      ? `&profile_ids=${profileIds.join(",")}`
      : "";

    // Construct timestamp and created_at query parameters
    const timestampQuery = timestampStart
      ? `&timestamp_start=${timestampStart}`
      : "";
    const timestampEndQuery = timestampEnd
      ? `&timestamp_end=${timestampEnd}`
      : "";
    const createdAtStartQuery = createdAtStart
      ? `&created_at_start=${createdAtStart}`
      : "";
    const createdAtEndQuery = createdAtEnd
      ? `&created_at_end=${createdAtEnd}`
      : "";

    const apiUrl = `${baseURL}/linkedin/posts?page=${page}&limit=${limit}${
      sortOrder ? `&sort=${sortOrder}&sort_by=${sortBy}` : ""
    }${profileIdsQuery}${timestampQuery}${timestampEndQuery}${createdAtStartQuery}${createdAtEndQuery}`;

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
      profiles: filterTypes?.profiles,
      sortBy: sortBy,
      timestampEnd: filterTypes?.timestampEnd,
      timestampStart: filterTypes?.timestampStart,
      createdAtEnd: filterTypes?.createdAtEnd,
      createdAtStart: filterTypes?.createdAtStart,
    });
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
      profiles: filterTypes?.profiles,
      sortBy: sortBy,
      timestampEnd: filterTypes?.timestampEnd,
      timestampStart: filterTypes?.timestampStart,
      createdAtEnd: filterTypes?.createdAtEnd,
      createdAtStart: filterTypes?.createdAtStart,
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
        profiles: filterTypes?.profiles,
        sortBy: sortBy,
        timestampEnd: filterTypes?.timestampEnd,
        timestampStart: filterTypes?.timestampStart,
        createdAtEnd: filterTypes?.createdAtEnd,
        createdAtStart: filterTypes?.createdAtStart,
      });
    } else {
      getPosts({ profiles: filterTypes?.profiles });
    }
  };

  const handleFilter = () => {
    if (!isDeepEqual(initialFilters, filterTypes)) {
      setFilterTypes(initialFilters);
      getPosts();
    } else {
      setFilterModal(true);
    }
  };

  const handleApplyFilter = async (profiles) => {
    await getPosts({
      profiles: profiles,
      timestampEnd: filterTypes?.timestampEnd,
      timestampStart: filterTypes?.timestampStart,
      createdAtEnd: filterTypes?.createdAtEnd,
      createdAtStart: filterTypes?.createdAtStart,
    });
  };

  useEffect(() => {
    if (!isDeepEqual(initialFilters, filterTypes)) {
      getPosts({
        profiles: filterTypes?.profiles,
        timestampEnd: filterTypes?.timestampEnd,
        timestampStart: filterTypes?.timestampStart,
        createdAtEnd: filterTypes?.createdAtEnd,
        createdAtStart: filterTypes?.createdAtStart,
      });
    } else {
      getPosts();
    }
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
        <h2 className="page-title">Posts</h2>
        <FilterButton
          handleFilter={handleFilter}
          isClear={!isDeepEqual(initialFilters, filterTypes)}
        />
      </div>
      <TableComponent
        rowData={data?.posts}
        columnDefs={columnDefs}
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
      <PostsFilter
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        handleApplyFilter={handleApplyFilter}
      />
    </div>
  );
};
