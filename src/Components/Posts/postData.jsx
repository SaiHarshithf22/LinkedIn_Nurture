import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { formatTimestamp } from "../../utils";
import { SaveContentCheckbox } from "../SaveContentCheckbox/SaveContentCheckbox";

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
    minWidth: 300,
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
          href={params?.data?.new_profile?.profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
        <a
          style={{ color: "black" }}
          href={`profile/${params?.data?.new_profile?.id}?name=${params?.data?.new_profile?.name}&profile=${params?.data?.new_profile?.profile}&position=${params?.data?.new_profile?.position}`}
          rel="noopener noreferrer"
        >
          {params?.data?.new_profile?.name}
        </a>
      </div>
    ),
  },
  {
    field: "url",
    headerName: "Post",
    minWidth: 500,
    flex: 1,
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
    field: "is_saved",
    headerName: "Save Post?",
    minWidth: 150,
    sortable: true,
    cellRenderer: (params) => {
      const obj = {
        id: params?.data?.id,
        value: params?.data?.is_saved,
        type: "Post",
      };
      return <SaveContentCheckbox name="is_saved" data={obj} />;
    },
  },
  {
    field: "timestamp",
    headerName: "Post created at",
    minWidth: 300,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.timestamp),
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    minWidth: 285,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];
