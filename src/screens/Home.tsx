import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
import { userSignOut } from "../firebase/f9_config";
import { ApplicationState, OnSetFilenames, OnSetCovers } from "../redux";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteCachedData } from "../redux_toolkit/slices/retrieveFeedSlice";

import { ImageCollectionData } from "../model/types";
import { useAppSelector } from "../redux_toolkit";

import { fetchFeedData } from "../redux_toolkit/slices/retrieveFeedSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderItem from "../components/RenderItem";

const _Home: React.FC = () => {
  const dispatch = useDispatch();

  const { isLoading } = useAppSelector((state) => state.feed);
  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);

  const { firstName, lastName, username, bio, avatar } = useAppSelector(
    (state) => state.userData.userData
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchFeedData());

    // console.log(feedCollectionCovers[1].title);
  }, [dispatch]);

  const calculateImageHeight = (
    imageWidth: number,
    imageHeight: number
  ): number => {
    const screenWidth = Dimensions.get("window").width;
    const aspectRatio = imageWidth / imageHeight;
    return screenWidth / aspectRatio;
  };

  // Assuming you are getting the date as a string in the format "YYYY-MM-DD"
  // You may need to modify this according to the actual format of the date you receive.
  const modifiedFeedCollectionCovers = feedCollectionCovers?.map((item) => {
    try {
      //TODO: Refactor assigning Date object in [Creator - line 114] / use Date that can easily be sorted
      // Split the date string by "/" to extract the month, day, and year
      const [month, day, year] = item.date.split("/");

      // Convert the date to the "YYYY-MM-DD" format
      const isoDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      // Create a Date object from the ISO date string
      const dateObject = new Date(isoDateString);

      return {
        ...item,
        date: dateObject.toISOString(), // Convert date to a valid format
      };
    } catch (error) {
      console.error("Error parsing date:", item.date);
      return item; // Return the original item if date parsing fails
    }
  });

  const sortedFeedCollectionCovers = modifiedFeedCollectionCovers?.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleOnRefresh = () => {
    //@ts-ignore
    dispatch(fetchFeedData()).then(() => setRefreshing(false));
  };

  const deleteAllCachedData = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();

      // Filter the keys to only include the ones that match the cache key pattern
      const cacheKeysToDelete = keys.filter((key) =>
        key.startsWith("feed-cache-data-")
      );

      // Use AsyncStorage.multiRemove to delete multiple items by their keys
      await AsyncStorage.multiRemove(cacheKeysToDelete);

      console.log("All cached data has been deleted.");
    } catch (e) {
      // Handle AsyncStorage error
      console.log("Error deleting cached data:", e);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={{ height: 30, marginTop: 20, marginBottom: 20 }}>
          <Text style={{ alignSelf: "center", fontSize: 25, fontWeight: 700 }}>
            COLLECTIONS
          </Text>
          {/* <Image
            source={require("../../assets/LOGO.png")}
            style={{ width: "100%" }}
            resizeMode="center"
          /> */}
        </View>
        {/* <ImageCacheProvider
          onPreloadComplete={() => console.log("cache load complete")}> */}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleOnRefresh}
            />
          }
          data={sortedFeedCollectionCovers}
          renderItem={({ item }) => <RenderItem item={item} />}
        />
        {/* </ImageCacheProvider> */}
      </SafeAreaView>
      <View style={styles.body}>
        <ButtonWithTitle
          title="Sign Out"
          height={50}
          width={325}
          onTap={() => {
            deleteAllCachedData();
            deleteCachedData("cached_feed_data");
            userSignOut();
          }}
        />
      </View>
    </View>
  );
};

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

const mapStateToProps = (state: ApplicationState) => ({
  imagesReducer: state.imagesReducer,
});

const HomeScreen = connect(mapStateToProps, { OnSetFilenames })(_Home);

export { HomeScreen };
