import { useEffect, useState } from "react";

export const useEntitiesSelect = (entities: string[]) => {
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const areAllEntitiesSelected = selectedEntities.length === entities.length;

  useEffect(() => {
    if (selectedEntities.find((entity) => !entities.includes(entity))) {
      setSelectedEntities((prevSelectedEntities) =>
        prevSelectedEntities.filter((filteredEntities) =>
          entities.includes(filteredEntities),
        ),
      );
    }
  }, [entities, selectedEntities]);

  const handleSelectEntity = (entity: string) => {
    setSelectedEntities((prevSelectedEntities) =>
      prevSelectedEntities.includes(entity)
        ? prevSelectedEntities.filter(
            (filteredEntities) => filteredEntities !== entity,
          )
        : [...prevSelectedEntities, entity],
    );
  };

  const handleSelectAllEntities = () => {
    areAllEntitiesSelected
      ? setSelectedEntities([])
      : setSelectedEntities(entities);
  };

  return {
    handleSelectEntity,
    handleSelectAllEntities,
    selectedEntities,
    areAllEntitiesSelected,
  };
};
