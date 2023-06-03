import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux_toolkit";
//TODO: Try MasonryList for view or develop code to create a masonry view / add onScroll feature that loads image as they are needed
import MasonryList from "@react-native-seoul/masonry-list";

import { fetchFilenames } from "../redux_toolkit/slices/filenameSlice";

import { ImageCollectionData, ImageData } from "../utils/types";
import ProfileMain from "../components/ProfileMAIN";

//*PROFILESWIPE
const { width } = Dimensions.get("window");
const COVER_WIDTH = width * 0.9;

function Profile(collectionData: { collectionData: ImageCollectionData[] }) {
  const dispatch = useAppDispatch();

  const { collectionsData } = useAppSelector(({ filenames }) => filenames);
  const { collectionCovers } = useAppSelector(({ filenames }) => filenames);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchFilenames());
  }, [dispatch]);

  const onTap = (item: any) => {
    console.log(item);
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity>
        <View style={styles.coverContainer}>
          <Image source={{ uri: item.imgUri }} style={[styles.coverImage]} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.views}>234 views</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.navigation}>
        <ProfileMain
          profilePicture="../../assets/stature.jpg"
          collections={123}
          fans={50}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.container}>
          <FlatList
            data={collectionCovers}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            onMomentumScrollEnd={(ev) => {
              const index = Math.floor(ev.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          />
          <View style={styles.pageIndicator}>
            {collectionCovers?.map(
              (data: ImageCollectionData, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentIndex ? "white" : "#d4d4d4",
                    },
                  ]}
                />
              )
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // backgroundColor: "green",
  // },
  navigation: {
    flex: 3,
    backgroundColor: "white",
  },
  body: {
    flex: 9,
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "cyan",
  },
  scrollViewContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // paddingHorizontal: 10,
  },
  column: {
    width: "100%",
    // borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  coverContainer: {
    width: width,
    marginTop: 70,
  },
  coverImage: {
    width: COVER_WIDTH,
    height: COVER_WIDTH,
    // borderRadius: COVER_WIDTH / 2,
    marginVertical: 30,
    alignSelf: "center",
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 40,
  },
  views: {
    marginLeft: 40,
    marginTop: 8,
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
  },
  dot: {
    width: 20,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
