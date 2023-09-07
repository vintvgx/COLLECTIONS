import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ImageCollectionData } from "../../model/types";
import { calculateImageHeight } from "../../utils/image";
import MediaComponent from "../MediaComponent";

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
        <MediaComponent
          uri={item?.image?.uri}
          type={item.image.type}
          style={[styles.imageStyles, { height: calculatedHeight }]}
          controls={true}
          play={true}
          muted={true}
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
