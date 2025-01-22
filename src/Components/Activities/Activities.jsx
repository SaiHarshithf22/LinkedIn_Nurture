import { useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import RadioButtons from "../RadioButton/RadioButton";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = [
  {
    filter: "agTextColumnFilter",
    field: "profile",
    headerName: "Profile",
    valueGetter: (params) => params.data.profile.name,
    cellRenderer: (params) => {
      return (
        <a
          href={params.data.profile.profile}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.data.profile.name}
        </a>
      );
    },
    width: 200,
    flex: 1,
  },
  {
    field: "activity_type",
    headerName: "Activity Type",
    filter: "agTextColumnFilter",
    flex: 1,
  },
  {
    flex: 2,
    field: "url",
    headerName: "Post",
    cellRenderer: (params) => {
      return (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params?.data?.post_content}
        </a>
      );
    },
  },
  {
    flex: 1,
    field: "post_author_linkedin_url",
    headerName: "Author Profile",
    cellRenderer: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View Profile
      </a>
    ),
  },
  { flex: 1, field: "user_comment", headerName: "User Comment", width: 300 },
  {
    flex: 1,
    field: "commenter_comment",
    headerName: "Commenter Comment",
    width: 300,
  },
];

export const Activites = () => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [activityType, setActivityType] = useState("all");
  const [perPage, setPerPage] = useState("20");
  const token = localStorage.getItem("authToken");
  const [sortType, setSortType] = useState("");

  const getActivities = async (params) => {
    const limit = params?.perPage ? params?.perPage : perPage;
    const pageNum = Number(params?.page);
    const validatedPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const sortOrder = params?.sortOrder ? params?.sortOrder : sortType;

    const selectedActivity = params?.activityType?.trim() || activityType;

    const queryParams = new URLSearchParams({
      page: validatedPage.toString(),
      limit: limit,
      activity_type: selectedActivity === "all" ? "" : selectedActivity,
      sort: sortOrder,
    });

    const apiUrl = `${baseURL}/linkedin/activities?${queryParams.toString()}`;
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
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const onPageChange = (event, value) => {
    getActivities({ page: value });
  };

  const handleSort = () => {
    setSortType((prev) => {
      const value = prev === "asc" ? "desc" : "asc";
      getActivities({ sortOrder: value });
      return value;
    });
  };

  const handlePerPageChange = (value) => {
    getActivities({ perPage: value });
    setPerPage(value);
  };

  const handleActivityTypeChange = async (value) => {
    await getActivities({ activityType: value });
  };

  useEffect(() => {
    getActivities();
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
        <div
          onClick={handleSort}
          style={{
            color: "#00165a",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <h2 style={{ color: "#00165a" }}>Activities</h2>
          <div
            style={{ color: "#00165a", display: "flex", alignItems: "center" }}
          >
            {sortType === "asc" ? (
              <ArrowDropDown />
            ) : sortType === "desc" ? (
              <ArrowDropUp />
            ) : null}
          </div>
        </div>
        <RadioButtons
          defaultValue="all"
          label="Activity Type"
          options={[
            { label: "All", value: "all" },
            { label: "Reaction", value: "reaction" },
            { label: "Comment", value: "comment" },
          ]}
          onChange={handleActivityTypeChange}
          value={activityType}
          setValue={setActivityType}
        />
      </div>
      <TableComponent
        rowData={data?.activities}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />
      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPerPageChange={handlePerPageChange}
        onPageChange={onPageChange}
        perPage={perPage}
      />
    </div>
  );
};
