import { useEffect, useState } from "react";
import { NameFilter } from "../NameFilter/NameFilter";
import { MaterialDialog } from "../Modal/Modal";
import { FilterDatePicker } from "../DatePicker/DatePicker";

export const PostsFilter = ({
  filterModal,
  setFilterModal,
  filterTypes,
  setFilterTypes,
  handleApplyFilter,
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
    setFilterTypes(() => {
      return {
        profiles: [],
        createdAtStart: "",
        createdAtEnd: "",
        timestampStart: "",
        timestampEnd: "",
      };
    });
    setProfiles([]);
    getData();
  };

  useEffect(() => {
    if (filterTypes?.profiles?.length === 0) {
      setProfiles([]);
    }
  }, [filterTypes?.profiles]);
  return (
    <MaterialDialog
      title={"Posts Filters"}
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
          <FilterDatePicker
            label="Post Created at"
            fromSelectedDate={filterTypes?.timestampStart}
            setFromSelectedDate={(val) =>
              setFilterTypes((prev) => {
                return { ...prev, timestampStart: val };
              })
            }
            toSelectedDate={filterTypes?.timestampEnd}
            setToSelectedDate={(val) =>
              setFilterTypes((prev) => {
                return { ...prev, timestampEnd: val };
              })
            }
          />
        </>
      }
    />
  );
};
