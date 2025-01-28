import { FilterAlt } from "@mui/icons-material";
import { ProfileCheckbox } from "../ProfileCheckbox/ProfileCheckbox";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { formatTimestamp } from "../../utils";

export const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    flex: 1,
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
            href={params.data.profile}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
          <a
            style={{ color: "black" }}
            href={`profile/${params.data.id}?name=${params?.data?.name}&profile=${params?.data?.profile}&position=${params?.data?.position}`}
            rel="noopener noreferrer"
          >
            {params.data.name || params?.data?.profile?.split("in/")?.[1]}
          </a>
        </div>
      );
    },
  },
  {
    field: "position",
    headerName: "Position",
    width: 200,
    flex: 1,
  },

  {
    field: "total_comments",
    headerName: "Total Comments",
    width: 200,
    flex: 1,
  },
  {
    field: "total_posts",
    headerName: "Total Posts",
    width: 200,
    flex: 1,
  },
  {
    field: "total_reactions",
    headerName: "Total Reactions",
    width: 200,
    flex: 1,
  },
  {
    field: "is_scrape_posts",
    headerName: "Scrape Posts",
    width: 200,
    flex: 1,
    cellRenderer: (params) => {
      return <ProfileCheckbox name="is_scrape_posts" data={params} />;
    },
  },
  {
    field: "is_scrape_comments",
    headerName: "Scrape Comments",
    width: 200,
    flex: 1,
    cellRenderer: (params) => (
      <ProfileCheckbox name="is_scrape_comments" data={params} />
    ),
  },
  {
    field: "is_scrape_reactions",
    headerName: "Scrape Reactions",
    width: 200,
    flex: 1,
    cellRenderer: (params) => (
      <ProfileCheckbox name="is_scrape_reactions" data={params} />
    ),
  },
  {
    field: "last_synced_at",
    headerName: "Last Synced",
    width: 200,
    flex: 1,
    valueGetter: (params) => {
      if (params.data.last_synced_at) {
        return formatTimestamp(params.data.last_synced_at);
      }
      return "";
    },
    tooltipValueGetter: (params) => {
      if (params.data.last_synced_at) {
        return formatTimestamp(params.data.last_synced_at);
      }
      return "";
    },
  },
];
