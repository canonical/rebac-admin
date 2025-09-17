import { useEffect, useState } from "react";

export type EntitiesSelect = {
  handleSelectEntity: (entity: string) => void;
  handleSelectAllEntities: () => void;
  selectedEntities: string[];
  areAllEntitiesSelected: boolean;
};

export const useEntitiesSelect = (entities: string[]): EntitiesSelect => {
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const areAllEntitiesSelected = selectedEntities.length === entities.length;

  // Ensures that the selected entities are always a subset of the entities list
  // and removes any entities that are no longer present in the entities list.
  useEffect(() => {
    if (selectedEntities.find((entity) => !entities.includes(entity))) {
      setSelectedEntities((prevSelectedEntities) =>
        prevSelectedEntities.filter((filteredEntities) =>
          entities.includes(filteredEntities),
        ),
      );
    }
  }, [entities, selectedEntities]);

  const handleSelectEntity = (entity: string): void => {
    setSelectedEntities((prevSelectedEntities) =>
      prevSelectedEntities.includes(entity)
        ? prevSelectedEntities.filter(
            (filteredEntities) => filteredEntities !== entity,
          )
        : [...prevSelectedEntities, entity],
    );
  };

  const handleSelectAllEntities = (): void => {
    if (areAllEntitiesSelected) {
      setSelectedEntities([]);
    } else {
      setSelectedEntities(entities);
    }
  };

  return {
    handleSelectEntity,
    handleSelectAllEntities,
    selectedEntities,
    areAllEntitiesSelected,
  };
};
