import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";

import { AppDispatch } from "../../redux_toolkit";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux_toolkit";
import { ImageCollectionData } from "../../model/types";
import { fetchFeedData } from "../../redux_toolkit/slices/retrieveFeedSlice";
import FeedController from "../../controller/FeedController";
import RenderItem from "../../components/RenderItem";
import { logFeedData } from "../../utils/functions";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/Navigation";

const FeedView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedCovers, setFeedCovers] = useState<ImageCollectionData[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animatedScrollPosition = new Animated.Value(0);

  const [refreshing, setRefreshing] = useState(false);
  const [updatedCollectionCovers, setUpdatedCollectionCovers] = useState<
    ImageCollectionData[] | null
  >(null);

  useEffect(() => {
    dispatch(fetchFeedData());
  }, [dispatch]);

  useEffect(() => {
    if (feedCollectionCovers) {
      // logFeedData(feedCollectionCovers);
      // Adding only new feedCollectionCovers
      setFeedCovers((prevCovers) => [
        ...prevCovers,
        ...feedCollectionCovers.filter(
          (cover) =>
            !prevCovers.some(
              (prevCover) => prevCover.image.fileName === cover.image.fileName
            ) // assuming `id` is unique
        ),
      ]);
    }

    logFeedData(feedCovers);
  }, [feedCollectionCovers]);

  const fetchMoreFeedData = () => {
    setLoadingMore(true);
    dispatch(fetchFeedData()).finally(() => {
      setLoadingMore(false);
    });
  };

  const handleOnRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchFeedData()); // Wait for the dispatch to complete
    } catch (error) {
      // Handle any errors that might occur during the dispatch
      console.error(error);
    }
    setRefreshing(false); // Update the refreshing state after the dispatch completes
    // logFeedData(feedCollectionCovers);
  };

  const handleImagePress = (imageData: {
    image?: { title?: string; uid?: string };
  }) => {
    if (imageData?.image) {
      navigation.navigate("CollectionFeedView", {
        title: imageData.image.title,
        uid: imageData.image.uid,
      });
    } else {
      console.error("Invalid imageData:", imageData);
    }
  };

  const headerHeight = animatedScrollPosition.interpolate({
    inputRange: [0, 100],
    outputRange: [30, 0],
    extrapolate: "clamp",
  });
  const headerOpacity = animatedScrollPosition.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const headerFontSize = animatedScrollPosition.interpolate({
    inputRange: [0, 100],
    outputRange: [25, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          height: headerHeight,
          marginTop: headerHeight,
          marginBottom: 20,
          opacity: headerOpacity,
        }}>
        <TouchableOpacity>
          <Text
            style={{
              alignSelf: "center",
              fontSize: scrollPosition > 100 ? 0 : 25,
              fontWeight: "700",
            }}>
            COLLECTIONS+
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animatedScrollPosition } } }], // Notice the change here
          { useNativeDriver: false } // Make sure to set this to false
        )}
        ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
        data={feedCovers}
        onEndReached={fetchMoreFeedData} // call function to fetch more data
        onEndReachedThreshold={0.9} // fetch more data when the end of the list is half a screen away
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              handleImagePress({
                image: { title: item.title, uid: item.image.uid },
              })
            }>
            <RenderItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.image.fileName.toString() + index}
      />
    </View>
  );
};

export default FeedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionCard: {
    flex: 1,
    marginBottom: 75,
  },
  title: {
    // fontFamily: "Arial Black",
    fontSize: 26,
    fontWeight: "700",
  },
  views: {
    fontSize: 15,
    color: "#777F88",
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    // marginBottom: 10,
    // marginTop: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    // borderRadius: 45,
    flex: 1,
    resizeMode: "cover",
  },
});
