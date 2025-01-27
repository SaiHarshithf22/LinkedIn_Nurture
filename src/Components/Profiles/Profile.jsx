import { useRef, useState, useEffect } from "react";
import TableComponent from "../Table/Table";
import Modal from "../Modal/Modal";
import { CustomPagination } from "../CustomPagination/Pagination";
import { columnDefs } from "./profileData";
import { FilterProfile } from "./ProfileModals";
import { useToast } from "../Toaster/Toaster";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import CSVUploader from "../CsvUpload/CsvUpload";
import { FilledButton, FilterButton, OutlineButton } from "../Buttons/Buttons";
import { isDeepEqual } from "../../utils";

const baseURL = import.meta.env.VITE_BASE_URL;

const ModalContent = ({ modalRef }) => {
  const [profileUrl, setProfileUrl] = useState("");
  const [scrapePosts, setScrapePosts] = useState(true);
  const [scrapeComments, setScrapeComments] = useState(true);
  const [scrapeReactions, setScrapeReactions] = useState(true);
  const showToast = useToast();

  const token = localStorage.getItem("authToken");

  const clearForm = () => {
    setProfileUrl("");
    setScrapePosts(true);
    setScrapeComments(true);
    setScrapeReactions(true);
  };

  const addNewProfile = async () => {
    if (!profileUrl) {
      showToast("Please add profile URL", "error");
      return;
    }
    const apiUrl = `${baseURL}/linkedin/profiles`;

    const requestBody = {
      profile: profileUrl,
      is_scrape_posts: scrapePosts,
      is_scrape_reactions: scrapeReactions,
      is_scrape_comments: scrapeComments,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        showToast(errorRes?.error, "error");
        throw new Error(errorRes?.error);
      }

      const data = await response.json();
      // Parse the JSON response
      if (data?.id) {
        clearForm();
        modalRef.current.close();
        showToast("Profile added successfully");
      }
    } catch (error) {
      console.error("Error posting profiles:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNewProfile();
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 32px",
        gap: "16px",
      }}
    >
      <input
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        type="text"
        name="url"
        placeholder="Add Profile URL"
        style={{
          color: "black",
          padding: "8px",
          fontSize: "18px",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "8px",
        }}
      />
      <CustomCheckbox
        label="Scrape Posts"
        initialValue={true}
        checked={scrapePosts}
        setChecked={setScrapePosts}
      />
      <CustomCheckbox
        label="Scrape Comments"
        initialValue={true}
        checked={scrapeComments}
        setChecked={setScrapeComments}
      />
      <CustomCheckbox
        label="Scrape Reactions"
        initialValue={true}
        checked={scrapeReactions}
        setChecked={setScrapeReactions}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <FilledButton type="submit" children="Submit" />
        <OutlineButton
          children="Close"
          type="button"
          onClick={() => {
            clearForm();
            modalRef.current.close();
          }}
        />
      </div>
    </form>
  );
};

const initialFilters = {
  profiles: [],
  scrapePosts: true,
  scrapeComments: true,
  scrapeReactions: true,
};

export const Profile = ({ perPage: initialPageSize, setPerPage }) => {
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });

  const [filterModal, setFilterModal] = useState(false);
  const modalRef = useRef(null);
  const token = localStorage.getItem("authToken");
  const [filterTypes, setFilterTypes] = useState(initialFilters);

  const getProfiles = async (params) => {
    const {
      page = 1,
      perPage = initialPageSize,
      profiles,
      is_scrape_posts,
      sort_by,
      sort_order,
      is_scrape_comments,
      is_scrape_reactions,
    } = params || {};

    const ids = profiles?.map((profile) => profile.id) || [];
    const profileIdsQuery = ids.length ? `&ids=${ids.join(",")}` : "";

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page,
      limit: perPage,
    });

    // Add optional parameters if they exist
    if (is_scrape_posts !== undefined)
      queryParams.append("is_scrape_posts", is_scrape_posts);
    if (sort_by) queryParams.append("sort_by", sort_by);
    if (sort_order) queryParams.append("sort_order", sort_order);
    if (is_scrape_comments !== undefined)
      queryParams.append("is_scrape_comments", is_scrape_comments);
    if (is_scrape_reactions !== undefined)
      queryParams.append("is_scrape_reactions", is_scrape_reactions);

    const apiUrl = `${baseURL}/linkedin/profiles?${queryParams.toString()}${profileIdsQuery}`;

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
      console.error("Error fetching profiles:", error);
      return null;
    }
  };

  const onPageChange = (event, value) => {
    getProfiles({
      page: value,
      profiles: filterTypes?.profiles,
      is_scrape_posts: filterTypes?.scrapePosts,
      is_scrape_comments: filterTypes?.scrapeComments,
      is_scrape_reactions: filterTypes?.scrapeReactions,
    });
  };

  const handlePerPageChange = (value) => {
    getProfiles({
      perPage: value,
      profiles: filterTypes?.profiles,
      is_scrape_posts: filterTypes?.scrapePosts,
      is_scrape_comments: filterTypes?.scrapeComments,
      is_scrape_reactions: filterTypes?.scrapeReactions,
    });
    setPerPage(value);
  };

  const handleFilter = () => {
    if (!isDeepEqual(initialFilters, filterTypes)) {
      setFilterTypes(initialFilters);
      getProfiles({});
    } else {
      setFilterModal(true);
    }
  };

  const handleApplyFilter = async (profiles) => {
    await getProfiles({
      profiles: profiles,
      is_scrape_posts: filterTypes?.scrapePosts,
      is_scrape_comments: filterTypes?.scrapeComments,
      is_scrape_reactions: filterTypes?.scrapeReactions,
    });
  };

  useEffect(() => {
    if (filterTypes?.profiles?.length > 0) {
      getProfiles({
        profiles: filterTypes?.profiles,
        is_scrape_posts: filterTypes?.scrapePosts,
        is_scrape_comments: filterTypes?.scrapeComments,
        is_scrape_reactions: filterTypes?.scrapeReactions,
      });
    } else {
      getProfiles();
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
        <h2 style={{ color: "#00165a" }}>Profiles</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <CSVUploader />
          <FilterButton
            handleFilter={handleFilter}
            selected={filterTypes?.profiles}
            isClear={!isDeepEqual(initialFilters, filterTypes)}
          />

          <FilledButton
            children={"Add Profile"}
            onClick={() => {
              modalRef.current?.showModal();
            }}
          />
        </div>
      </div>
      <TableComponent
        rowData={data?.profiles}
        columnDefs={columnDefs}
        height="600px"
        width="900px"
      />

      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPageChange={onPageChange}
        onPerPageChange={handlePerPageChange}
        perPage={initialPageSize}
      />

      <Modal
        modalRef={modalRef}
        title={"Add New Profile"}
        content={<ModalContent modalRef={modalRef} />}
      />

      <FilterProfile
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        handleApplyFilter={handleApplyFilter}
      />
    </div>
  );
};
