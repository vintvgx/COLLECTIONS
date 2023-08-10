import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux_toolkit";
import { AppDispatch, RootState } from "../redux_toolkit/store"; // Check the actual path of your store file

import {
  fetchFeedUserData,
  selectFeedLoading,
} from "../redux_toolkit/slices/retrieveFeedSlice";

import CustomCachedImage from "../components/CustomCachedImage";
import { calculateImageHeight } from "../utils/image";
// import CachedImage from "expo-cached-image";
import CachedImage from "react-native-image-cache-wrapper";
import FeedSkeletonView from "./FeedSkeletonView";
import { db } from "../utils/firebase/f9_config";
import { doc, getDoc } from "firebase/firestore";
import { UserData } from "../model/types";

interface RenderItemProps {
  item: any;
}

const RenderItem: React.FC<RenderItemProps> = ({ item }) => {
  const dispatch: AppDispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);

  /**
   * NOTE:
   * By specifying the RootState type, TypeScript will correctly infer the type of the isLoading state
   * from the Redux store, and the "'state' is of type 'unknown'" error should be resolved.
   */
  const isLoading = useSelector((state: RootState) => state.feed.isLoading);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const calculatedHeight = calculateImageHeight(
    item.image.width,
    item.image.height
  );
  const imageUrl = item.image.uri;

  const handleImageLoadStart = () => {
    setIsImageLoading(true);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const dateString = item.image.createdAt;
  const date = new Date(dateString);

  const userFriendlyDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // if (isLoading) {
  //   return <FeedSkeletonView />;
  // }

  //TODO Fix LOADING component when image is loading // handleImageLoad
  //TODO: Convert back to CachedImage / look up file location set&get
  return (
    <View>
      <View style={styles.collectionCard}>
        <View>
          {/* {isImageLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading</Text>
            </View>
          ) : ( */}
          <Image
            source={{ uri: item.image.uri }}
            // cachekey={cacheKey}
            style={{
              flex: 1,
              height: calculatedHeight,
              alignSelf: "stretch",
            }}
            resizeMode="contain"
            // onLoadStrart={handleImageLoadStart}
            // onLoadEnd={handleImageLoad}
          />
          {/* )} */}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ marginTop: 8, marginLeft: 5 }}>
            <Text style={styles.title}>{item.title}</Text>
            {/* <Text style={styles.views}>234 views</Text>
            <Text style={styles.views}>{userFriendlyDate}</Text> */}
          </View>

          <View
            ///TODO align contents to be placaed both in the vertically centered
            style={{
              flexDirection: "row",
              marginRight: 5,
              alignItems: "center",
            }}>
            {/* <ProfileMain profilePicture={avatar?.uri} collections={123} fans={50} /> */}
            <Text style={{ color: "#777F88" }}>{item.userData?.username}</Text>
            <TouchableOpacity style={styles.circle}>
              <Image
                source={{ uri: item.userData?.avatar.uri }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Set an appropriate height while loading
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
    width: 30,
    height: 30,
    borderRadius: 45,
    flex: 1,
    resizeMode: "cover",
  },
});

export default RenderItem;
