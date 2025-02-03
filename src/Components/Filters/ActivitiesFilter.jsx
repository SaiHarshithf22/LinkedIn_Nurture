import { useEffect, useState } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import RadioButtons from "../RadioButton/RadioButton";
import { MaterialDialog } from "../Modal/Modal";
import { FilterDatePicker } from "../DatePicker/DatePicker";

export const ActivitiesFilter = ({
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

  const handleSelectProfiles = async () => {
    setFilterTypes((prev) => {
      return {
        ...prev,
        profiles: profiles,
      };
    });
    await handleApplyFilter({ profiles: profiles });
    handleFilterClose();
  };

  const handleClearFilter = () => {
    setProfiles([]);
    setFilterTypes(() => {
      return {
        profiles: [],
        activityType: "all",
        createdAtStart: "",
        createdAtEnd: "",
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
      title={"Activities Filters"}
      handleApply={handleSelectProfiles}
      filterModal={filterModal}
      handleFilterClose={handleFilterClose}
      handleClearFilter={handleClearFilter}
      children={
        <>
          <NameFilter
            selectedProfiles={profiles}
            setSelectedProfiles={setProfiles}
          />
          <RadioButtons
            label="Activity Type"
            defaultValue="all"
            options={[
              { label: "All", value: "all" },
              { label: "Reaction", value: "reaction" },
              { label: "Comment", value: "comment" },
            ]}
            value={filterTypes?.activityType}
            setValue={(val) =>
              setFilterTypes((prev) => {
                return {
                  ...prev,
                  activityType: val,
                };
              })
            }
            onChange={() => {}}
          />
          <FilterDatePicker
            label="Post Synced at"
            fromSelectedDate={filterTypes?.createdAtStart}
            setFromSelectedDate={(val) =>
              setFilterTypes((prev) => {
                return { ...prev, createdAtStart: val };
              })
            }
            toSelectedDate={filterTypes?.createdAtEnd}
            setToSelectedDate={(val) =>
              setFilterTypes((prev) => {
                return { ...prev, createdAtEnd: val };
              })
            }
          />
        </>
      }
    />
  );
};
