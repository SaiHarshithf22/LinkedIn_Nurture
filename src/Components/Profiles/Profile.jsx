import { useRef, useState, useEffect } from "react";
import TableComponent from "../Table/Table";
import Modal from "../Modal/Modal";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";
import { ProfileCheckbox } from "../ProfileCheckbox/ProfileCheckbox";
import { useToast } from "../Toaster/Toaster";
import { Pagination } from "@mui/material";
import { CustomPagination } from "../CustomPagination/Pagination";

const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <a href={params.data.profile} target="_blank" rel="noopener noreferrer">
          {params.data.name}
        </a>
      );
    },
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

const baseURL = import.meta.env.VITE_BASE_URL;

const ModalContent = ({ modalRef }) => {
  const [profileUrl, setProfileUrl] = useState("");
  const [scrapePosts, setScrapePosts] = useState(true);
  const [scrapeComments, setScrapeComments] = useState(true);
  const [scrapeReactions, setScrapeReactions] = useState(true);
  const showToast = useToast();

  const token = localStorage.getItem("authToken");
  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const addNewProfile = async () => {
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON response
      if (data?.id) {
        modalRef.current.close();
      }
    } catch (error) {
      showToast("Error adding profiles", error);
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
        style={{ padding: "8px", fontSize: "18px" }}
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
        <button
          type="submit"
          style={buttonStyle}
          onClick={() => {
            modalRef.current?.showModal();
          }}
        >
          Add Profile
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
          }}
          onClick={() => {
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
  const [data, setData] = useState({
    pagination: { total: 10, current_page: 1, total_pages: 1, per_page: 20 },
  });
  const modalRef = useRef(null);
  const token = localStorage.getItem("authToken");

  const getProfiles = async (page) => {
    const apiUrl = `${baseURL}/linkedin/profiles?page=${page ? page : 1}`;

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
    getProfiles(value);
  };

  useEffect(() => {
    getProfiles();
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
        <h2>Profiles</h2>
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
          New Profile
        </button>
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
      />

      <Modal
        modalRef={modalRef}
        title={"Add New Profile"}
        content={<ModalContent modalRef={modalRef} />}
      />
    </div>
  );
};
