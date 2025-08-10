/**
 * Determines if a workout ID is temporary (optimistic) or real (from server)
 * Temporary IDs are generated using Date.now() which results in large numbers (13+ digits)
 * Real database IDs are typically smaller sequential numbers
 */
const isTemporaryWorkoutId = (id: number): boolean => {
  return id > 0 && id < 1;
};

export const separateRealAndTemporaryIds = (ids: number[]) => {
  const realIds = ids.filter(id => !isTemporaryWorkoutId(id));
  const temporaryIds = ids.filter(id => isTemporaryWorkoutId(id));
  return { realIds, temporaryIds };
};
