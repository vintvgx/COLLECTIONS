// CollectionFlatListView.js

import React from "react";
import { FlatList, Animated } from "react-native";
import CollectionFeedViewRenderItem from "../../components/CollectionFeedView/CollectionFeedViewRenderItem";
import { ImageCollectionData } from "../../model/types";

interface CollectionFlatListViewProps {
  data: ImageCollectionData[];
  scrollY: Animated.Value;
  onViewableItemsChanged: any; // You can be more specific here
}

const CollectionFlatListView: React.FC<CollectionFlatListViewProps> = ({
  data,
  scrollY,
  onViewableItemsChanged,
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      data={data}
      renderItem={({ item }) => <CollectionFeedViewRenderItem item={item} />}
      keyExtractor={(item, index) => index.toString()}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
    />
  );
};

export default CollectionFlatListView;
