import { useEffect, useState } from "react";

import type { Role } from "api/api.schemas";

export const useRolesSelect = (roles: Role[]) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const areAllRolesSelected = selectedRoles.length === roles.length;

  useEffect(() => {
    if (selectedRoles.find((role) => !roles.includes(role)) !== undefined) {
      setSelectedRoles((prevSelectedRoles) =>
        prevSelectedRoles.filter((filteredRole) =>
          roles.includes(filteredRole),
        ),
      );
    }
  }, [roles, selectedRoles]);

  const handleSelectRole = (role: Role) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role)
        ? prevSelectedRoles.filter((filteredRole) => filteredRole !== role)
        : [...prevSelectedRoles, role],
    );
  };

  const handleSelectAllRoles = () => {
    areAllRolesSelected ? setSelectedRoles([]) : setSelectedRoles(roles);
  };

  return {
    handleSelectRole,
    handleSelectAllRoles,
    selectedRoles,
    areAllRolesSelected,
  };
};
