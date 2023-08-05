import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux_toolkit";
import { ImageCollectionData } from "../../model/types";
import { fetchFeedData } from "../../redux_toolkit/slices/retrieveFeedSlice";
import FeedController from "../../controller/FeedController";
import RenderItem from "../../components/RenderItem";
import { logFeedData } from "../../utils/functions";

const FeedView: React.FC = () => {
  const dispatch = useDispatch();
  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedCollectionCovers, setUpdatedCollectionCovers] = useState<
    ImageCollectionData[] | null
  >(null);

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchFeedData());
  }, [dispatch]);

  const fetchMoreFeedData = () => {
    //@ts-ignore
    dispatch(fetchFeedData());
  };

  const handleOnRefresh = () => {
    //@ts-ignore
    dispatch(fetchFeedData()).then(() => setRefreshing(false));
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
          data={feedCollectionCovers}
          // onEndReached={fetchMoreFeedData} // call function to fetch more data
          // onEndReachedThreshold={0.5} // fetch more data when the end of the list is half a screen away
          renderItem={({ item }) => <RenderItem item={item} />}
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
