import { useState, useEffect } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import { MaterialDialog } from "../Modal/Modal";
import { CustomCheckbox } from "../CustomCheckbox/CustomCheckbox";

export const FilterProfile = ({
  filterModal,
  setFilterModal,
  handleApplyFilter,
  filterTypes,
  setFilterTypes,
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
      children={
        <>
          {" "}
          <NameFilter
            selectedProfiles={profiles}
            setSelectedProfiles={setProfiles}
          />
          <CustomCheckbox
            label="Scrape Posts"
            checked={filterTypes?.scrapePosts}
            setChecked={(value) => {
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapePosts: value,
                };
              });
            }}
          />
          <CustomCheckbox
            label="Scrape Comments"
            checked={filterTypes?.scrapeComments}
            setChecked={(value) => {
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapeComments: value,
                };
              });
            }}
          />
          <CustomCheckbox
            label="Scrape Reactions"
            checked={filterTypes?.scrapeReactions}
            setChecked={(value) => {
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  scrapeReactions: value,
                };
              });
            }}
          />
        </>
      }
    />
  );
};
