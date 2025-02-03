import { useEffect, useState, useRef } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import { isDeepEqual } from "../../utils";
import { ActivitiesFilter } from "../Filters/ActivitiesFilter";
import { FilterButton } from "../Buttons/Buttons";
import {
  activitiesSortByKeys,
  activityColumnDefs,
  activityInitialFilters,
} from "./data";

const baseURL = import.meta.env.VITE_BASE_URL;

export const Activites = ({ perPage, setPerPage }) => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [filterTypes, setFilterTypes] = useState(activityInitialFilters);
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
    const sortBy = params?.sortBy || "";

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
    }

    if (sortBy) {
      queryParamsObj.sort_by = sortBy;
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
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);
    const sortBy = activitiesSortByKeys(sortModel?.colId);

    getActivities({
      page: value,
      profiles: filterTypes?.profiles,
      sortOrder: sortModel?.sort,
      activityType: filterTypes?.activityType,
      createdAtStart: filterTypes?.createdAtStart,
      createdAtEnd: filterTypes?.createdAtEnd,
      sortBy: sortBy,
    });
  };

  const handlePerPageChange = (value) => {
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);
    const sortBy = activitiesSortByKeys(sortModel?.colId);

    getActivities({
      perPage: value,
      profiles: filterTypes?.profiles,
      sortOrder: sortModel?.sort,
      activityType: filterTypes?.activityType,
      createdAtStart: filterTypes?.createdAtStart,
      createdAtEnd: filterTypes?.createdAtEnd,
      sortBy: sortBy,
    });
    setPerPage(value);
  };

  const onSortChanged = (event) => {
    const sortModel = event.api.getColumnState().find((col) => col.sort);
    const sortBy = activitiesSortByKeys(sortModel?.colId);

    if (sortModel?.sort) {
      getActivities({
        perPage: perPage,
        sortOrder: sortModel?.sort,
        sortBy: sortBy,
        profiles: filterTypes?.profiles,
        activityType: filterTypes?.activityType,
        createdAtStart: filterTypes?.createdAtStart,
        createdAtEnd: filterTypes?.createdAtEnd,
      });
    } else {
      getActivities({
        profiles: filterTypes?.profiles,
        activityType: filterTypes?.activityType,
        createdAtStart: filterTypes?.createdAtStart,
        createdAtEnd: filterTypes?.createdAtEnd,
      });
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
    setFilterModal(true);
  };

  const handleClearFilter = () => {
    if (!isDeepEqual(activityInitialFilters, filterTypes)) {
      setFilterTypes(activityInitialFilters);
      getActivities();
    }
  };

  useEffect(() => {
    if (!isDeepEqual(activityInitialFilters, filterTypes)) {
      getActivities({
        profiles: filterTypes?.profiles,
        activityType: filterTypes?.activityType,
        createdAtStart: filterTypes?.createdAtStart,
        createdAtEnd: filterTypes?.createdAtEnd,
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
        <FilterButton handleFilter={handleFilter} />
      </div>
      <TableComponent
        rowData={data?.activities}
        columnDefs={activityColumnDefs}
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
        handleClearFilter={handleClearFilter}
        getData={getActivities}
      />
    </div>
  );
};
