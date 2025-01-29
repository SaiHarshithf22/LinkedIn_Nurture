import { FilterAlt } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import RadioButtons from "../RadioButton/RadioButton";
import { CustomPagination } from "../CustomPagination/Pagination";
import TableComponent from "../Table/Table";
import { formatTimestamp } from "../../utils";

const activityColumnDefs = (activityRef) => [
  {
    width: 180,
    field: "activity_type",
    headerName: "Activity Type",

    headerComponent: (params) => (
      <div
        onClick={() => activityRef.current?.showModal()}
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
    width: 300,
    field: "url",
    headerName: "Post",
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
    width: 200,
    field: "post_author_linkedin_url",
    headerName: "Author Profile",
    cellRenderer: (params) => (
      <a
        style={{ color: "#0056b3" }}
        href={params.value}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Profile
      </a>
    ),
  },
  {
    field: "user_comment",
    headerName: "User Comment",
    width: 220,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "commenter_comment",
    headerName: "Commenter Comment",
    width: 200,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    width: 200,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
    tooltipValueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

const baseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("authToken");

export const UserActivity = ({ id, perPage, setPerPage }) => {
  const [activitiesData, setActivitiesData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const activityRef = useRef(null);
  const [activityType, setActivityType] = useState("all");

  const gridApi = useRef(null);

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const getActivities = async (params) => {
    const limit = params?.perPage ?? perPage;
    const pageNum = Number(params?.page);
    const validatedPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const sortOrder = params?.sortOrder || "";
    const profileId = params?.profileId;

    const selectedActivity = params?.activityType?.trim() || activityType;

    // Create an object to store non-empty query parameters
    const queryParamsObj = {
      page: validatedPage.toString(),
      limit: limit.toString(),
    };

    // Only add activity_type if it's not "all"
    if (selectedActivity && selectedActivity !== "all") {
      queryParamsObj.activity_type = selectedActivity;
    }

    // Only add sort and sort_by if sortOrder is provided
    if (sortOrder) {
      queryParamsObj.sort = sortOrder;
      queryParamsObj.sort_by = "created_at";
    }

    const queryParams = new URLSearchParams(queryParamsObj);
    const apiUrl = `${baseURL}/linkedin/activities?${queryParams.toString()}&profile_ids=${profileId}`;

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
        setActivitiesData(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const handleActivityTypeChange = async (value) => {
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);
    await getActivities({
      activityType: value,
      profileId: id,
      sortOrder: sortModel?.sort,
    });
    activityRef?.current?.close();
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
    getActivities({ perPage: value, profileIds: ids, sortOrder: sortModel });
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    if (sortModel?.sort) {
      getActivities({ sortOrder: sortModel.sort, profileId: id });
    } else {
      getActivities({ profileId: id });
    }
  };

  const onActivitiesPageChange = (event, value) => {
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    getActivities({ page: value, profileId: id, sortOrder: sortModel });
  };

  useEffect(() => {
    if (id) {
      getActivities({ profileId: id });
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
        <div
          style={{
            color: "#00165a",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <h2 className="page-title">Activities</h2>
        </div>
      </div>
      <TableComponent
        rowData={activitiesData?.activities}
        columnDefs={activityColumnDefs(activityRef)}
        onSortChanged={onSortChanged}
        onGridReady={onGridReady}
      />
      <CustomPagination
        totalPages={activitiesData?.pagination?.total_pages}
        currentPage={activitiesData?.pagination?.current_page}
        onPerPageChange={handlePerPageChange}
        onPageChange={onActivitiesPageChange}
        perPage={perPage}
      />
      <Modal
        modalRef={activityRef}
        title={"Filter Activity Type"}
        content={
          <div>
            <RadioButtons
              defaultValue="all"
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
        }
      />
    </div>
  );
};
