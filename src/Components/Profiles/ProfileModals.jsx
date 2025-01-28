import { useState, useEffect } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import { MaterialDialog } from "../Modal/Modal";

export const FilterProfile = ({
  filterModal,
  setFilterModal,
  selectedProfiles,
  setSelectedProfiles,
}) => {
  const [profiles, setProfiles] = useState([]);

  const handleFilterClose = () => {
    setFilterModal(false);
  };

  const handleSelectProfiles = () => {
    setSelectedProfiles(profiles);
    handleFilterClose();
  };

  useEffect(() => {
    if (selectedProfiles?.length === 0) {
      setProfiles([]);
    }
  }, [selectedProfiles]);

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
        </>
      }
    />
  );
};
