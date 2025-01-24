import { useContext, useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import RadioButtons from "../RadioButton/RadioButton";
import { ArrowDropDown, ArrowDropUp, FilterAlt } from "@mui/icons-material";
import { ProfileContext } from "../Home/Home";
import Modal from "../Modal/Modal";
import { useRef } from "react";
import { formatTimestamp } from "../../utils";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = (activityRef) => [
  {
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
    flex: 1,
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
    flex: 1.4,
    field: "url",
    headerName: "Post",
    cellRenderer: (params) => {
      return (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params?.data?.post_content}
        </a>
      );
    },
    tooltipValueGetter: (params) => params?.data?.post_content,
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
  {
    flex: 1,
    field: "createdAt",
    headerName: "Created On",
    width: 300,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
    tooltipValueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

export const Activites = () => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [activityType, setActivityType] = useState("all");
  const [perPage, setPerPage] = useState("20");
  const token = localStorage.getItem("authToken");
  const { profilesSelected } = useContext(ProfileContext);
  const ids = profilesSelected?.map((profile) => profile.id);
  const activityRef = useRef(null);
  const gridApi = useRef(null);

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const getActivities = async (params) => {
    const limit = params?.perPage ?? perPage;
    const pageNum = Number(params?.page);
    const validatedPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const sortOrder = params?.sortOrder || "";
    const profileIds = params?.profileIds || [];

    const profileIdsQuery = profileIds.length
      ? `&${profileIds.map((id) => `profile_ids[]=${id}`).join("&")}`
      : "";

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
    const apiUrl = `${baseURL}/linkedin/activities?${queryParams.toString()}${profileIdsQuery}`;

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
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    getActivities({ page: value, profileIds: ids, sortOrder: sortModel });
  };

  const handlePerPageChange = (value) => {
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    getActivities({ perPage: value, profileIds: ids, sortOrder: sortModel });
    setPerPage(value);
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    if (sortModel?.sort) {
      getActivities({ sortOrder: sortModel.sort, profileIds: ids });
    } else {
      getActivities({ profileIds: ids });
    }
  };

  const handleActivityTypeChange = async (value) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    await getActivities({
      activityType: value,
      profileIds: ids,
      sortOrder: sortModel.sort,
    });
    activityRef?.current?.close();
  };

  useEffect(() => {
    if (profilesSelected?.length > 0) {
      getActivities({ profileIds: ids });
    } else {
      getActivities();
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
        <div
          style={{
            color: "#00165a",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <h2 style={{ color: "#00165a" }}>Activities</h2>
        </div>
      </div>
      <TableComponent
        rowData={data?.activities}
        columnDefs={columnDefs(activityRef)}
        height="600px"
        width="900px"
        onSortChanged={onSortChanged}
        onGridReady={onGridReady}
      />
      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPerPageChange={handlePerPageChange}
        onPageChange={onPageChange}
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
