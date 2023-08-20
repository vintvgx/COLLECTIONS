import { ViewToken } from "react-native";
import { fetchCollectionData } from "../redux_toolkit/slices/retrieveFeedSlice";

class CollectionFeedViewController {
  static viewableItemsChanged(
    setCurrentItemIndex: (index: number) => void
  ): (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void {
    return (info) => {
      if (
        info.viewableItems.length > 0 &&
        info.viewableItems[0].index !== null
      ) {
        setCurrentItemIndex(info.viewableItems[0].index + 1);
      }
    };
  }

  static async fetchCollection(
    dispatch: Function,
    title: string,
    uid: string
  ): Promise<void> {
    try {
      await dispatch(fetchCollectionData({ title, uid }));
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  }

  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
}

export default CollectionFeedViewController;
