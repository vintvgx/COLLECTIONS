import { ImageCollectionData } from "./types";

/**
 * Converts the collection data to be displayed in MasonryList
 *
 * @used Profile.tsx
 * @param collectionCovers
 * @returns
 */
export function convertDataForMasonryList(
  collectionCovers: ImageCollectionData[] | undefined
) {
  const formattedData: any[] = [];

  if (collectionCovers) {
    for (let index = 0; index < collectionCovers.length; index++) {
      const item = collectionCovers[index];
      const width = Math.floor(Math.random() * 2) + 1; // Random width between 1 and 2
      const height = Math.floor(Math.random() * 2) + 1; // Random height between 1 and 2
      const randomBool = Math.random() < 0.5;

      formattedData.push({
        id: index.toString(),
        ...item,
        width,
        height,
        randomBool,
      });
    }
  } else {
    return [];
  }

  return formattedData;
}
