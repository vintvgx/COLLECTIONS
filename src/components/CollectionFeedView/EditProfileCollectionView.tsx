import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Feather } from "@expo/vector-icons";

import { ImageCollectionData } from "../../model/types";
import { calculateImageHeight } from "../../utils/image";

interface EditProfileCollectionViewProps {
  data: ImageCollectionData[];
  scrollY: Animated.Value;
  onViewableItemsChanged: any; // You can be more specific here
  onOrderChanged: (newOrder: ImageCollectionData[]) => void;
}

const EditProfileCollectionView: React.FC<EditProfileCollectionViewProps> = ({
  data,
  scrollY,
  onViewableItemsChanged,
  onOrderChanged,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const draggableListWidth = (1 / 4) * screenWidth;
  const [imageData, setImageData] = useState(data);
  const [showControlsForImage, setShowControlsForImage] = useState<
    number | null
  >(null);

  const updateImageIds = (newData: ImageCollectionData[]) => {
    return newData.map((item, index) => ({
      ...item,
      image: { ...item.image, id: index },
    }));
  };

  const renderCollectionImage = ({ item }: { item: ImageCollectionData }) => {
    if (item.image && item.image.width && item.image.height) {
      const calculatedHeight = calculateImageHeight(
        item.image.width,
        item.image.height
      );

      return (
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            source={item.image.uri ? { uri: item.image.uri } : null}
            style={[styles.imageStyles, { height: calculatedHeight }]}
          />
        </View>
      );
    } else {
      return null; // or a placeholder component
    }
  };

  const handlePress = (id: number) => {
    setShowControlsForImage(showControlsForImage === id ? null : id);
  };

  const renderDraggable = useCallback(
    ({ item, drag, index }) => {
      const [isImageLoaded, setImageLoaded] = useState(false);
      const calculatedHeight = calculateImageHeight(
        item.image.width,
        item.image.height,
        draggableListWidth
      );

      const id = item.image.id;
      const handlePress = () => {
        setShowControlsForImage(showControlsForImage === id ? null : id);
      };

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowControlsForImage(null)}
          style={styles.touchableContainer}>
          <TouchableOpacity
            onPress={handlePress}
            onLongPress={drag}
            style={styles.draggableContainer}
            activeOpacity={0.9}>
            <View style={styles.imageShadowContainer}>
              <Image
                resizeMode="cover"
                source={{ uri: item.image.uri }}
                style={[
                  styles.draggableImage,
                  {
                    width: draggableListWidth,
                    height: calculatedHeight,
                  },
                ]}
              />
              <Text style={styles.draggableText}>{id}</Text>
              {showControlsForImage === id && (
                <Animated.View
                  style={[
                    styles.controlOverlay,
                    {
                      width: draggableListWidth,
                      height: calculatedHeight,
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => console.log("Edit pressed")}>
                    <Feather name="edit" size={20} color="white" />
                    {/* <Text style={styles.controlText}>Edit</Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => console.log("Delete pressed")}>
                    <Feather name="trash" size={20} color="red" />
                    {/* <Text style={styles.controlText}>Delete</Text> */}
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [showControlsForImage]
  );

  return (
    <View style={{ flexDirection: "row" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        renderItem={renderCollectionImage}
        data={imageData}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
      <DraggableFlatList
        data={imageData}
        renderItem={renderDraggable}
        keyExtractor={(item, index) => `draggable-${index}`}
        onDragEnd={({ data }) => {
          const updatedData = updateImageIds(data);
          setImageData(updatedData);
          onOrderChanged(updatedData); // Notify parent component about reordered data
        }}
      />
    </View>
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
  touchableContainer: {
    flex: 1,
  },
  draggableContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  // imageShadowContainer: {
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  // },
  draggableImage: {
    backgroundColor: "lightgray",
    borderRadius: 8,
  },
  draggableText: {
    textAlign: "center",
    padding: 5,
    fontSize: 12,
    color: "#333",
  },
  controlOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
  },
  controlButton: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  controlText: {
    color: "white",
    marginLeft: 5,
  },
});
