import { useContext, useEffect, useState } from "react";
import TableComponent from "../Table/Table";
import { CustomPagination } from "../CustomPagination/Pagination";
import RadioButtons from "../RadioButton/RadioButton";
import { ArrowDropDown, ArrowDropUp, FilterAlt } from "@mui/icons-material";
import { ProfileContext } from "../Home/Home";
import Modal from "../Modal/Modal";
import { useRef } from "react";

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
  const { profilesSelected } = useContext(ProfileContext);
  const ids = profilesSelected?.map((profile) => profile.id);
  const activityRef = useRef(null);

  const getActivities = async (params) => {
    const limit = params?.perPage ? params?.perPage : perPage;
    const pageNum = Number(params?.page);
    const validatedPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const sortOrder = params?.sortOrder ? params?.sortOrder : sortType;
    const profileIds = params?.profileIds || [];

    const profileIdsQuery = profileIds.length
      ? `&${profileIds.map((id) => `profile_ids[]=${id}`).join("&")}`
      : "";

    const selectedActivity = params?.activityType?.trim() || activityType;

    const queryParams = new URLSearchParams({
      page: validatedPage.toString(),
      limit: limit,
      activity_type: selectedActivity === "all" ? "" : selectedActivity,
      sort: sortOrder,
    });

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
    getActivities({ page: value, profileIds: ids });
  };

  const handleSort = () => {
    setSortType((prev) => {
      const value = prev === "asc" ? "desc" : "asc";
      getActivities({ sortOrder: value, profileIds: ids });
      return value;
    });
  };

  const handlePerPageChange = (value) => {
    getActivities({ perPage: value, profileIds: ids });
    setPerPage(value);
  };

  const handleActivityTypeChange = async (value) => {
    await getActivities({ activityType: value, profileIds: ids });
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
          // onClick={handleSort}
          style={{
            color: "#00165a",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <h2 style={{ color: "#00165a" }}>Activities</h2>
          {/* <div
            style={{ color: "#00165a", display: "flex", alignItems: "center" }}
          >
            {sortType === "asc" ? (
              <ArrowDropDown />
            ) : sortType === "desc" ? (
              <ArrowDropUp />
            ) : null}
          </div> */}
        </div>
      </div>
      <TableComponent
        rowData={data?.activities}
        columnDefs={columnDefs(activityRef)}
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
