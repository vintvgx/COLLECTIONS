import { ImageCollectionData } from "./types";
import { useDispatch } from "react-redux";
import { addCollectionData } from "../redux_toolkit/slices/addCollectionSlice";

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

export const handleSaveButtonPress = (
  setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
  setImageCount: React.Dispatch<React.SetStateAction<number>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  images: ImageData[]
) => {
  const dispatch = useDispatch();
  console.log("save pressed");
  // setCollectionTitle("");
  // setImageCount(images.length);
  // setShowModal(true);

  if (images.length === 0) {
    return;
  }

  try {
    const dataState: ImageCollectionData = {
      images,
      title: collectionTitle,
    };

    await dispatch(addCollectionData(dataState));
    setCollectionTitle("");
    setImageCount(0);
    setShowModal(false);
    setImages([]);
  } catch (error) {
    console.log("Error:", error);
  }
};
