import { logger } from "utils/logger";

type Entity = {
  id?: unknown;
};

export const getIds = <E extends Entity>(entities?: E[]) => {
  return (
    entities?.reduce<NonNullable<E["id"]>[]>((ids, entity) => {
      if (entity.id) {
        ids.push(entity.id);
      } else {
        logger.warn("entity doesn't contain an ID:", entity);
      }
      return ids;
    }, []) ?? []
  );
};
