import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ImageCollectionData } from "../../model/types";
import { calculateImageHeight } from "../../utils/image";

interface RenderItemProps {
  item: ImageCollectionData;
}

const CollectionFeedViewRenderItem: React.FC<RenderItemProps> = ({ item }) => {
  if (item.image && item.image.width && item.image.height) {
    const calculatedHeight = calculateImageHeight(
      item.image.width,
      item.image.height
    );
    return (
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={{ uri: item.image.uri }}
          style={[styles.imageStyles, { height: calculatedHeight }]}
        />
      </View>
    );
  } else {
    return null; // or a placeholder component
  }
};

export default CollectionFeedViewRenderItem;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
    flex: 1,
  },
  imageStyles: {
    width: "100%",
    alignSelf: "stretch",
    flex: 1,
  },
});
