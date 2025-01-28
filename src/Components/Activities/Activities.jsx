import { useContext, useEffect, useState, useRef } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import RadioButtons from "../RadioButton/RadioButton";
import { FilterAlt } from "@mui/icons-material";
import { ProfileContext } from "../Home/Home";
import Modal from "../Modal/Modal";

import { formatTimestamp } from "../../utils";
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
    width: 200,
    flex: 1,
  },
  {
    field: "activity_type",
    headerName: "Activity Type",
    flex: 1,
  },
  {
    flex: 1.4,
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
    flex: 1,
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
    flex: 1,
    field: "user_comment",
    headerName: "User Comment",
    width: 300,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    flex: 1,
    field: "commenter_comment",
    headerName: "Commenter Comment",
    width: 300,
    tooltipValueGetter: (params) => params?.value,
  },
  {
    flex: 1,
    field: "createdAt",
    headerName: "Post synced at",
    width: 300,
    sortable: true,
    unSortIcon: true,
    valueGetter: (params) => formatTimestamp(params.data.createdAt),
    tooltipValueGetter: (params) => formatTimestamp(params.data.createdAt),
  },
];

export const Activites = ({ perPage, setPerPage }) => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });

  const token = localStorage.getItem("authToken");
  const [filterModal, setFilterModal] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const ids = selectedProfiles?.map((profile) => profile.id);

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
      ? `&profile_ids=${profileIds.join(",")}`
      : "";

    const selectedActivity = params?.activityType?.trim() || "all";

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

  const handleApplyFilter = async ({ activity, profiles }) => {
    const sortModel = gridApi.current?.getColumnState().find((col) => col.sort);
    const ids = profiles?.map((profile) => profile.id);

    await getActivities({
      activityType: activity,
      profileIds: ids,
      sortOrder: sortModel?.sort,
    });
  };

  const handleFilter = () => {
    if (selectedProfiles?.length) {
      setSelectedProfiles([]);
      getActivities();
    } else {
      setFilterModal(true);
    }
  };

  useEffect(() => {
    if (selectedProfiles?.length > 0) {
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
        <FilterButton handleFilter={handleFilter} selected={selectedProfiles} />
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
        selectedProfiles={selectedProfiles}
        setSelectedProfiles={setSelectedProfiles}
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        handleApplyFilter={handleApplyFilter}
      />
    </div>
  );
};
