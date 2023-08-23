import React from "react";
import { StyleSheet, View, FlatList, Image, Animated } from "react-native";
import { ImageCollectionData } from "../../model/types";
import { calculateImageHeight } from "../../utils/image";
import CollectionFeedViewRenderItem from "./CollectionFeedViewRenderItem";

interface EditProfileCollectionViewProps {
  data: ImageCollectionData[];
  scrollY: Animated.Value;
  onViewableItemsChanged: any; // You can be more specific here
}

const EditProfileCollectionView: React.FC<EditProfileCollectionViewProps> = ({
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

export default EditProfileCollectionView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
    flex: 1,
    paddingHorizontal: 20,
  },
  imageStyles: {
    width: "100%",
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "lightgray",
  },
});
