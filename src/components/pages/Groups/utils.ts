import { useEffect, useState } from "react";

import type { Group } from "api/api.schemas";

export const useGroupsSelect = (groups: Group[]) => {
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const areAllGroupsSelected = selectedGroups.length === groups.length;

  useEffect(() => {
    if (selectedGroups.find((group) => !groups.includes(group)) !== undefined) {
      setSelectedGroups((prevSelectedGroups) =>
        prevSelectedGroups.filter((filteredGroup) =>
          groups.includes(filteredGroup),
        ),
      );
    }
  }, [groups, selectedGroups]);

  const handleSelectGroup = (group: Group) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(group)
        ? prevSelectedGroups.filter((filteredGroup) => filteredGroup !== group)
        : [...prevSelectedGroups, group],
    );
  };

  const handleSelectAllGroups = () => {
    areAllGroupsSelected ? setSelectedGroups([]) : setSelectedGroups(groups);
  };

  return {
    handleSelectGroup,
    handleSelectAllGroups,
    selectedGroups,
    areAllGroupsSelected,
  };
};
