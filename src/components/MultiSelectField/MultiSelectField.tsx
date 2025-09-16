import type { MultiSelectItem } from "@canonical/react-components";
import { MultiSelect, SearchBox, Spinner } from "@canonical/react-components";
import fastDeepEqual from "fast-deep-equal";

import { pluralize } from "utils";

import type { Props } from "./types";

const mapItems = <E,>(
  generateItem: Props<E>["generateItem"],
  entities: E[],
): MultiSelectItem[] =>
  entities.reduce<MultiSelectItem[]>((items, entity) => {
    const item = generateItem(entity);
    if (item) {
      items.push(item);
    }
    return items;
  }, []);

const MultiSelectField = <E,>({
  addEntities,
  entityName,
  existingEntities,
  entities,
  entityMatches,
  generateItem,
  isLoading,
  onSearch,
  removeEntities,
  setAddEntities,
  setRemoveEntities,
  ...selectProps
}: Props<E>): JSX.Element => {
  return (
    <div className="multi-select-field">
      <MultiSelect
        {...selectProps}
        selectedItems={mapItems(
          generateItem,
          (existingEntities || [])
            .concat(addEntities)
            .filter(
              (entity) =>
                !removeEntities.find((removeEntity) =>
                  fastDeepEqual(entity, removeEntity),
                ),
            ),
        )}
        dropdownHeader={
          <div className="multi-select-field__search">
            <SearchBox onSearch={onSearch} />
            {isLoading ? <Spinner /> : null}
          </div>
        }
        items={mapItems(generateItem, entities)}
        listSelected={false}
        onDeselectItem={(item) => {
          if (addEntities.find((entity) => entityMatches(entity, item))) {
            setAddEntities(
              addEntities.filter((entity) => !entityMatches(entity, item)),
            );
          } else {
            const removeEntity = entities.find((entity) =>
              entityMatches(entity, item),
            );
            if (removeEntity) {
              setRemoveEntities([...removeEntities, removeEntity]);
            }
          }
        }}
        onSelectItem={(item) => {
          if (removeEntities.find((entity) => entityMatches(entity, item))) {
            setRemoveEntities(
              removeEntities.filter((entity) => !entityMatches(entity, item)),
            );
          } else {
            const addEntity = entities.find((entity) =>
              entityMatches(entity, item),
            );
            if (addEntity) {
              setAddEntities([...addEntities, addEntity]);
            }
          }
        }}
        placeholder={`Select ${pluralize(entityName)}`}
        showDropdownFooter={false}
        variant="condensed"
      />
    </div>
  );
};

export default MultiSelectField;
