import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { formatTimestamp } from "../../utils";

export const activityInitialFilters = {
  profiles: [],
  activityType: "all",
  createdAtEnd: "",
  createdAtStart: "",
};

export const activityColumnDefs = [
  {
    field: "profile",
    headerName: "Name",
    valueGetter: (params) => params.data.profile.name,
    cellRenderer: (params) => {
      return (
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
      );
    },
    minWidth: 250,
  },
  {
    field: "activity_type",
    headerName: "Activity Type",
    minWidth: 170,
    sortable: true,
  },
  {
    minWidth: 250,
    field: "url",
    headerName: "Post",
    flex: 1,
    cellRenderer: (params) => {
      return (
        <a
          style={{ color: "#0056b3" }}
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params?.data?.post_content}
        </a>
      );
    },
    tooltipValueGetter: (params) => params?.data?.post_content,
  },
  {
    minWidth: 200,
    field: "post_author_linkedin_url",
    headerName: "Author Profile",
    cellRenderer: (params) => {
      return (
        <a
          style={{ color: "#0056b3" }}
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params?.data?.author_name
            ? params?.data?.author_name
            : "View Profile"}
        </a>
      );
    },
  },
  {
    field: "user_comment",
    headerName: "User Comment",
    minWidth: 250,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "commenter_comment",
    headerName: "Commenter Comment",
    minWidth: 250,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    minWidth: 250,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
    tooltipValueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

export const activitiesSortByKeys = (colId) => {
  const sortMap = {
    profile: "profile.name",
    activity_type: "activity_type",
    createdAt: "created_at",
  };
  return sortMap[colId] || "";
};
