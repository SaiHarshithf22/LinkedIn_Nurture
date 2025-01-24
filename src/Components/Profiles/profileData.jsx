import { FilterAlt } from "@mui/icons-material";
import { ProfileCheckbox } from "../ProfileCheckbox/ProfileCheckbox";

export const columnDefs = (setFilterModal) => [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <a href={params.data.profile} target="_blank" rel="noopener noreferrer">
          {params.data.name || params?.data?.profile?.split("in/")?.[1]}
        </a>
      );
    },
    headerComponent: (params) => (
      <div
        onClick={() => setFilterModal(true)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{params.displayName}</span>
        <span style={{ marginLeft: "5px", fontSize: "12px" }}>
          <FilterAlt />
        </span>
      </div>
    ),
  },
  {
    field: "position",
    headerName: "Position",
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
];
