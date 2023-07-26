import { Dimensions } from "react-native";
import { ImageCollectionData } from "../model/types";
import Feed from "../view/LoggedIn/FeedView";

class FeedController {
  static async calculateImageDimensions(
    imageWidth: number,
    imageHeight: number
  ): Promise<number> {
    const screenWidth = Dimensions.get("window").width;
    const aspectRatio = imageWidth / imageHeight;
    return screenWidth / aspectRatio;
  }

  static async collection_updateDateProp(
    collectionCover: ImageCollectionData[] | undefined
  ): Promise<any> {
    return collectionCover?.map((item) => {
      try {
        const [month, day, year] = item.date.split("/");
        const isoDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        const dateObject = new Date(isoDateString);
        return {
          ...item,
          date: dateObject.toISOString(), // Convert date to a valid format
        };
      } catch (error) {
        console.error("Error parsing date:", item.date);
        return item;
      }
    });
  }

  static async sortCollectionByDate(
    collectionCover: ImageCollectionData[] | undefined
  ): Promise<any> {
    return collectionCover?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}

export default FeedController;
