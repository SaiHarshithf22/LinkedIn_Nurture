import { useEffect, useState, useRef } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import { formatTimestamp, isDeepEqual } from "../../utils";
import { ActivitiesFilter } from "../Filters/ActivitiesFilter";
import { FilterButton } from "../Buttons/Buttons";

const baseURL = import.meta.env.VITE_BASE_URL;

const columnDefs = [
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
    width: 250,
  },
  {
    field: "activity_type",
    headerName: "Activity Type",
    width: 170,
  },
  {
    width: 250,
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
    width: 250,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "commenter_comment",
    headerName: "Commenter Comment",
    width: 250,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    field: "createdAt",
    headerName: "Post synced at",
    width: 250,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
    tooltipValueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

const initialFilters = {
  profiles: [],
  activityType: "all",
  createdAtEnd: "",
  createdAtStart: "",
};

export const Activites = ({ perPage, setPerPage }) => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [filterTypes, setFilterTypes] = useState(initialFilters);
  const token = localStorage.getItem("authToken");
  const [filterModal, setFilterModal] = useState(false);

  const gridApi = useRef(null);

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const getActivities = async (params) => {
    const ids = params?.profiles?.map((profile) => profile.id) || [];
    const limit = params?.perPage ?? perPage;
    const pageNum = Number(params?.page);
    const validatedPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const sortOrder = params?.sortOrder || "";
    const createdAtStart = params?.createdAtStart || "";
    const createdAtEnd = params?.createdAtEnd || "";

    const profileIdsQuery = ids.length ? `&profile_ids=${ids.join(",")}` : "";

    const selectedActivity = params?.activityType?.trim() || "all";

    // Create an object to store non-empty query parameters
    const queryParamsObj = {
      page: validatedPage.toString(),
      limit: limit.toString(),
    };

    if (createdAtStart) {
      queryParamsObj.created_at_start = createdAtStart;
    }
    if (createdAtEnd) {
      queryParamsObj.created_at_end = createdAtEnd;
    }

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
    getActivities({
      page: value,
      profiles: filterTypes?.profiles,
      sortOrder: sortModel,
      activityType: filterTypes?.activityType,
      createdAtStart: filterTypes?.createdAtStart,
      createdAtEnd: filterTypes?.createdAtEnd,
    });
  };

  const handlePerPageChange = (value) => {
    const sortModel = gridApi.current
      ?.getColumnState()
      .find((col) => col.sort)?.sort;
    getActivities({
      perPage: value,
      profiles: filterTypes?.profiles,
      sortOrder: sortModel,
      activityType: filterTypes?.activityType,
      createdAtStart: filterTypes?.createdAtStart,
      createdAtEnd: filterTypes?.createdAtEnd,
    });
    setPerPage(value);
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    if (sortModel?.sort) {
      getActivities({
        perPage: value,
        sortOrder: sortModel.sort,
        profiles: filterTypes?.profiles,
        activityType: filterTypes?.activityType,
      });
    } else {
      getActivities({ profiles: filterTypes?.profiles });
    }
  };

  const handleApplyFilter = async ({ profiles }) => {
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);

    await getActivities({
      activityType: filterTypes?.activityType,
      profiles: profiles,
      sortOrder: sortModel?.sort,
      createdAtStart: filterTypes?.createdAtStart,
      createdAtEnd: filterTypes?.createdAtEnd,
    });
  };

  const handleFilter = () => {
    if (!isDeepEqual(initialFilters, filterTypes)) {
      setFilterTypes(initialFilters);
      getActivities();
    } else {
      setFilterModal(true);
    }
  };

  useEffect(() => {
    if (!isDeepEqual(initialFilters, filterTypes)) {
      getActivities({
        profiles: filterTypes?.profiles,
        activityType: filterTypes?.activityType,
      });
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
          <h2 className="page-title">Activities</h2>
        </div>
        <FilterButton
          handleFilter={handleFilter}
          isClear={!isDeepEqual(initialFilters, filterTypes)}
        />
      </div>
      <TableComponent
        rowData={data?.activities}
        columnDefs={columnDefs}
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

      <ActivitiesFilter
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        handleApplyFilter={handleApplyFilter}
      />
    </div>
  );
};
