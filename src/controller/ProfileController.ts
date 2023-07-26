import { ImageCollectionData } from "../model/types";

class ProfileController {
  static async setImageHeightAndWeight(
    collectionCover: ImageCollectionData[] | undefined
  ): Promise<any[]> {
    if (!collectionCover || collectionCover.length === 0) {
      return [];
    }

    return collectionCover?.map((item, index) => {
      try {
        const width = Math.floor(Math.random() * 2) + 1;
        const height = Math.floor(Math.random() * 2) + 1;
        const randomBool = Math.random() < 0.5;

        return {
          id: index.toString(),
          ...item,
          width: width,
          height: height,
          randomBool: randomBool,
          key: index,
        };
      } catch (error) {
        console.error("Error parsing date:", item.date);
        return item;
      }
    });
  }
}

export default ProfileController;
