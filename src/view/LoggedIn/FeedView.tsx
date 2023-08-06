import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

const FeedView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedCovers, setFeedCovers] = useState<ImageCollectionData[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [updatedCollectionCovers, setUpdatedCollectionCovers] = useState<
    ImageCollectionData[] | null
  >(null);

  useEffect(() => {
    dispatch(fetchFeedData());
  }, [dispatch]);

  useEffect(() => {
    if (feedCollectionCovers) {
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity
          style={{ height: 30, marginTop: 20, marginBottom: 20 }}>
          <Text
            style={{ alignSelf: "center", fontSize: 25, fontWeight: "700" }}>
            COLLECTIONS+
          </Text>
        </TouchableOpacity>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleOnRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
          data={feedCovers}
          onEndReached={fetchMoreFeedData} // call function to fetch more data
          onEndReachedThreshold={0.2} // fetch more data when the end of the list is half a screen away
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item) => item.image.fileName.toString()} // assuming each item has a unique id
        />
      </SafeAreaView>
    </View>
  );
};

export default FeedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
