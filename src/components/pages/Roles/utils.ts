import { useState } from "react";

import type { Role } from "api/api.schemas";

export const useRolesSelect = (roles: Role[]) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const areAllRolesSelected = selectedRoles.length === roles.length;

  const handleSelectRole = (role: Role) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role)
        ? prevSelectedRoles.filter((r) => r !== role)
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
