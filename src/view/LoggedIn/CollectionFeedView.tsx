import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  ViewToken,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux_toolkit";
import { useDispatch } from "react-redux";
import { fetchCollectionData } from "../../redux_toolkit/slices/retrieveFeedSlice";
import { calculateImageHeight } from "../../utils/image";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const sharedBackgroundColor = "white";
const sharedFontColor = "black";
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight : 20;

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
  const navigation = useNavigation();

  const { title, uid } = route.params;
  const dataCollection = useSelector(
    (state: RootState) => state.feed.collectionsData
  );
  const [showTitle, setShowTitle] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
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
    outputRange: [200, 0], // start height and end height
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

  const headerTitleFade = scrollY.interpolate({
    inputRange: [190, 300], // it'll start changing just 10 units before it reaches 200
    outputRange: [0, 1], // 0 opacity for most of the scrolling until it reaches near 200, then suddenly goes to 1.
    extrapolate: "clamp",
  });

  const titleMarginLeft = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 0], // Adjust if necessary based on screen width and text width
    extrapolate: "clamp",
  });

  const viewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      // Only update when there's at least one item
      if (
        info.viewableItems.length > 0 &&
        info.viewableItems[0].index !== null
      ) {
        setCurrentItemIndex(info.viewableItems[0].index + 1); // +1 because arrays are 0-indexed
      }
    }
  ).current;

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
          {/* <Text>{item.image.fileName}</Text> */}
        </View>
      );
    } else {
      return null; // or a placeholder component
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={sharedBackgroundColor}
        barStyle="dark-content"
      />
      {showTitle ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={styles.title_text}>{title}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}>
            <Image
              source={{ uri: userData?.avatar.uri }}
              style={styles.profileImage}
            />
            <Text style={styles.username_text}>{userData?.username}</Text>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.header}>
            {/*Header*/}
            <Animated.Text
              style={{ color: sharedFontColor, opacity: headerTitleFade }}>
              {`${currentItemIndex}/${dataCollection?.length}`}
            </Animated.Text>
            <Animated.Text
              style={[styles.header_title_text, { opacity: headerTitleFade }]}>
              {title}
            </Animated.Text>
            <View style={styles.rightIcons}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="menu" size={20} color="black"></Feather>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: sharedFontColor }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Animated.View
            style={[
              styles.contentDetails,
              {
                height: headerHeight,
                backgroundColor: sharedBackgroundColor,
              },
            ]}>
            <Animated.Text
              style={[
                styles.title_text,
                { opacity: titleOpacity, marginLeft: titleMarginLeft },
              ]}>
              {title}
            </Animated.Text>
          </Animated.View>
          <FlatList
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50, // adjust this value as needed
            }}
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
    </SafeAreaView>
  );
};

export default CollectionFeedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center", // This will center the content horizontally
    backgroundColor: "white",
    // paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    height: 45,
    flexDirection: "row", // Use row direction to allow items to be aligned horizontally
    justifyContent: "space-between", // This pushes your icon to the right
    paddingHorizontal: 10, // A little padding to ensure it doesn't touch the very edge
    alignItems: "center", // This ensures it's vertically centered
    backgroundColor: sharedBackgroundColor,
  },
  rightIcons: {
    flexDirection: "row", // Horizontal alignment
    alignItems: "center", // Vertically center align items
    justifyContent: "space-between", // Space the items apart
    width: 65, // You might want to adjust this based on your needs.
    color: sharedFontColor,
  },
  contentDetails: {
    // remove any specific height
    alignItems: "flex-start", // center align horizontally
    justifyContent: "center",
    color: sharedFontColor,
  },
  title_text: {
    fontSize: 30,
    fontWeight: "bold",
    color: sharedFontColor,

    // textAlign: "left", // align left within Text component
  },
  header_title_text: {
    fontSize: 15,
    fontWeight: "bold",
    color: sharedFontColor,
  },
  username_text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    // textAlign: "left", // align left within Text component
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
    flex: 1,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 45,
    // flex: 1,
    resizeMode: "cover",
    marginRight: 10,
  },
});
