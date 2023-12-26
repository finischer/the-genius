import { ObjectId } from "bson";

/**
 * If given ID is not an valid ObjectID, it will creates a new ObjectID and return it as string. Otherwise the given ID will be returned.
 */
export function getOrCreateObjectId(id: string) {
  return ObjectId.isValid(id) ? id : new ObjectId().toString();
}
