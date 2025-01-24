import { useRef, useState, useEffect, useContext } from "react";
import TableComponent from "../Table/Table";
import Modal from "../Modal/Modal";
import { CustomPagination } from "../CustomPagination/Pagination";
import { columnDefs } from "./profileData";
import { buttonStyle, FilterProfile } from "./ProfileModals";
import { useToast } from "../Toaster/Toaster";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import { ProfileContext } from "../Home/Home";
import CSVUploader from "../CsvUpload/CsvUpload";

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
        <button type="submit" style={buttonStyle}>
          Add Profile
        </button>
        <button
          type="button"
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
          }}
          onClick={() => {
            clearForm();
            modalRef.current.close();
          }}
        >
          Close
        </button>
      </div>
    </form>
  );
};

export const Profile = () => {
  const { profilesSelected, setProfileSelected } = useContext(ProfileContext);
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const [perPage, setPerPage] = useState("20");
  const [filterModal, setFilterModal] = useState(false);
  const modalRef = useRef(null);
  const token = localStorage.getItem("authToken");

  const getProfiles = async (params) => {
    const page = params?.page ? params?.page : 1;
    const limit = params?.perPage ? params?.perPage : perPage;
    const apiUrl = `${baseURL}/linkedin/profiles?page=${
      page ? page : 1
    }&limit=${limit}`;

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
    getProfiles({ page: value });
  };

  const handlePerPageChange = (value) => {
    getProfiles({ perPage: value });
    setPerPage(value);
  };

  const handleClearFilter = () => {
    setProfileSelected([]);
  };

  useEffect(() => {
    if (profilesSelected?.length > 0) {
      setData((prev) => {
        return {
          pagination: {
            total: profilesSelected.length,
            current_page: 1,
            total_pages: 1,
            per_page: 20,
          },
          profiles: profilesSelected,
        };
      });
    } else {
      getProfiles();
    }
  }, [profilesSelected]);

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
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              modalRef.current?.showModal();
            }}
          >
            Add Profile
          </button>
        </div>
      </div>
      <TableComponent
        rowData={data?.profiles}
        columnDefs={columnDefs(setFilterModal)}
        height="600px"
        width="900px"
      />

      <CustomPagination
        totalPages={data?.pagination?.total_pages}
        currentPage={data?.pagination?.current_page}
        onPageChange={onPageChange}
        onPerPageChange={handlePerPageChange}
        perPage={perPage}
      />

      <Modal
        modalRef={modalRef}
        title={"Add New Profile"}
        content={<ModalContent modalRef={modalRef} />}
      />

      <FilterProfile
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        setProfileSelected={setProfileSelected}
      />
    </div>
  );
};
