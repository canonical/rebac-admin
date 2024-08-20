import type {
  MultiSelectProps,
  PropsWithSpread,
  MultiSelectItem,
} from "@canonical/react-components";

export type Props<E> = PropsWithSpread<
  {
    addEntities: E[];
    entities: E[];
    entityMatches: (entity: E, item: MultiSelectItem) => boolean;
    entityName: string;
    existingEntities?: E[];
    generateItem: (item: E) => MultiSelectItem | null | undefined;
    isLoading?: boolean;
    onSearch: (searchValue: string) => void;
    removeEntities: E[];
    setAddEntities: (addEntities: E[]) => void;
    setRemoveEntities: (removeEntities: E[]) => void;
  },
  Partial<MultiSelectProps>
>;
