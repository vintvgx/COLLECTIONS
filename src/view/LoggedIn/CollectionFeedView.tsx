import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux_toolkit";
import { useDispatch } from "react-redux";
import { fetchCollectionData } from "../../redux_toolkit/slices/retrieveFeedSlice";
import { calculateImageHeight } from "../../utils/image";

// Define your Stack Navigator Param List
type RootStackParamList = {
  CollectionFeedView: {
    title: string;
    uid: string;
  };
  // Other Screens...
};

type CollectionFeedViewProps = {
  route: RouteProp<RootStackParams, "CollectionFeedView">;
};

const CollectionFeedView: React.FC<CollectionFeedViewProps> = ({ route }) => {
  const dispatch: AppDispatch = useDispatch();
  const { title, uid } = route.params;
  const dataCollection = useSelector(
    (state: RootState) => state.feed.collectionsData
  );
  const [showTitle, setShowTitle] = useState(true);
  const fadeAnim = new Animated.Value(1);
  const scrollY = new Animated.Value(0);
  const userData = useSelector((state: RootState) => state.feed.userData);

  //   console.log(`IMAGE TITTLE ${title} & USER UID ${uid}`);

  useEffect(() => {
    try {
      async function fetchCollection() {
        await dispatch(fetchCollectionData({ title, uid }));
      }
      fetchCollection();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200], // adjust this based on your needs
    outputRange: [200, 80], // start height and end height
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 200], // adjust this based on your needs
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // const titleAlign = scrollY.interpolate({
  //   inputRange: [0, 200], // adjust this based on your needs
  //   outputRange: ["flex-start", "center"],
  //   extrapolate: "clamp",
  // });

  const titleMarginLeft = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 50], // Adjust if necessary based on screen width and text width
    extrapolate: "clamp",
  });

  dataCollection?.map((doc) => {
    console.log(`data doc: ${doc.image?.fileName}`);
  });

  // assuming dataCollection is an array, you can directly use it in FlatList
  const renderImageItem = ({
    item,
  }: {
    item: { image: { url: string; width: number; height: number } };
  }) => {
    console.log("Item:", item);
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
            style={{
              height: calculatedHeight,
              width: "100%",
              alignSelf: "stretch",
              flex: 1,
            }}
          />
          <Text>{item.image.fileName}</Text>
        </View>
      );
    } else {
      return null; // or a placeholder component
    }
  };

  return (
    <View style={styles.container}>
      {showTitle ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={styles.text}>{title}</Text>
        </View>
      ) : (
        <View>
          <Animated.View
            style={[
              styles.header,
              {
                height: headerHeight,
                backgroundColor: "orange",
              },
            ]}>
            <Animated.Text
              style={[
                styles.text,
                { opacity: titleOpacity, marginLeft: titleMarginLeft },
              ]}>
              {title}
            </Animated.Text>
          </Animated.View>
          <FlatList
            data={dataCollection}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false } // Make sure to set this to false
            )}
            // rest of your FlatList properties...
          />
        </View>
      )}
    </View>
  );
};

export default CollectionFeedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center", // This will center the content horizontally
    backgroundColor: "#FFF",
  },
  header: {
    // remove any specific height
    alignItems: "left", // center align horizontally
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    // textAlign: "left", // align left within Text component
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
    flex: 1,
  },
});
