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
}

export default CollectionFeedViewController;
