import { useEffect, useState } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import RadioButtons from "../RadioButton/RadioButton";
import { MaterialDialog } from "../Modal/Modal";

export const ActivitiesFilter = ({
  filterModal,
  setFilterModal,
  selectedProfiles,
  setSelectedProfiles,
  handleApplyFilter,
}) => {
  const [activityType, setActivityType] = useState("all");
  const [profiles, setProfiles] = useState([]);
  const handleFilterClose = () => {
    setFilterModal(false);
  };

  const handleSelectProfiles = async () => {
    setSelectedProfiles(profiles);
    await handleApplyFilter({ activity: activityType, profiles: profiles });
    handleFilterClose();
  };

  useEffect(() => {
    if (selectedProfiles?.length === 0) {
      setProfiles([]);
    }
  }, [selectedProfiles]);
  return (
    <MaterialDialog
      title={"Activities Filters"}
      handleApply={handleSelectProfiles}
      filterModal={filterModal}
      handleFilterClose={handleFilterClose}
      children={
        <>
          <NameFilter
            selectedProfiles={profiles}
            setSelectedProfiles={setProfiles}
          />
          <RadioButtons
            defaultValue="all"
            options={[
              { label: "All", value: "all" },
              { label: "Reaction", value: "reaction" },
              { label: "Comment", value: "comment" },
            ]}
            value={activityType}
            setValue={setActivityType}
            onChange={() => {}}
          />
        </>
      }
    />
  );
};
