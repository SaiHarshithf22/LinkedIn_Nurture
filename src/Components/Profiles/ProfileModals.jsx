import { useState, useEffect } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import { MaterialDialog } from "../Modal/Modal";
import RadioButtons from "../RadioButton/RadioButton";

export const FilterProfile = ({
  filterModal,
  setFilterModal,
  handleApplyFilter,
  filterTypes,
  setFilterTypes,
  getData,
}) => {
  const [profiles, setProfiles] = useState([]);

  const handleFilterClose = () => {
    setFilterModal(false);
  };

  const handleSelectProfiles = () => {
    setFilterTypes((prev) => {
      return {
        ...prev,
        profiles: profiles,
      };
    });
    handleFilterClose();
    handleApplyFilter(profiles);
  };

  const handleClearFilter = () => {
    setProfiles([]);

    setFilterTypes(() => {
      return {
        profiles: [],
        scrapePosts: "",
        scrapeComments: "",
        scrapeReactions: "",
      };
    });
    getData();
  };

  useEffect(() => {
    if (filterTypes?.profiles?.length === 0) {
      setProfiles([]);
    }
  }, [filterTypes?.profiles]);

  return (
    <MaterialDialog
      title={"Profile Filters"}
      handleApply={handleSelectProfiles}
      filterModal={filterModal}
      handleFilterClose={handleFilterClose}
      handleClearFilter={handleClearFilter}
      children={
        <>
          {" "}
          <NameFilter
            selectedProfiles={profiles}
            setSelectedProfiles={setProfiles}
          />
          <RadioButtons
            label="Scrape Posts"
            options={[
              { label: "Both", value: "" },
              { label: "Enabled", value: "true" },
              { label: "Disbaled", value: "false" },
            ]}
            value={filterTypes?.scrapePosts}
            setValue={(val) =>
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapePosts: val,
                };
              })
            }
            onChange={() => {}}
          />
          <RadioButtons
            label="Scrape Comments"
            options={[
              { label: "Both", value: "" },
              { label: "Enabled", value: "true" },
              { label: "Disbaled", value: "false" },
            ]}
            value={filterTypes?.scrapeComments}
            setValue={(val) =>
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapeComments: val,
                };
              })
            }
            onChange={() => {}}
          />
          <RadioButtons
            label="Scrape Reactions"
            options={[
              { label: "Both", value: "" },
              { label: "Enabled", value: "true" },
              { label: "Disabled", value: "false" },
            ]}
            value={filterTypes?.scrapeReactions}
            setValue={(val) =>
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapeReactions: val,
                };
              })
            }
            onChange={() => {}}
          />
        </>
      }
    />
  );
};
