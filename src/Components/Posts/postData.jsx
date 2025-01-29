import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { formatTimestamp } from "../../utils";

export const postSortByKeys = (colId) => {
  const sortMap = {
    "profile.name": "profile.name",
    timestamp: "timestamp",
    createdAt: "created_at",
  };

  return sortMap[colId] || "";
};

export const postInitialFilters = {
  profiles: [],
  timestampEnd: "",
  timestampStart: "",
  createdAtEnd: "",
  createdAtStart: "",
};

export const postColumnDefs = [
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
