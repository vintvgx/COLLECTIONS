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
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux_toolkit";
//TODO: Try MasonryList for view or develop code to create a masonry view / add onScroll feature that loads image as they are needed
import MasonryList from "@react-native-seoul/masonry-list";

import { fetchFilenames } from "../redux_toolkit/slices/filenameSlice";

import { fetchUserData } from "../redux_toolkit/slices/user_data";

import { convertDataForMasonryList } from "../utils/functions";

import { ImageCollectionData, ImageData } from "../utils/types";
import ProfileMain from "../components/ProfileMAIN";
import { useNavigation } from "@react-navigation/native";

//*PROFILESWIPE
const { width } = Dimensions.get("window");
const COVER_WIDTH = width * 0.9;

export interface ProfileData {
  collectionData: ImageCollectionData[];
}

const Profile: React.FC<ProfileData> = ({ collectionData }) => {
  const dispatch = useAppDispatch();

  // const {isLoading } = useAppSelector((state) => state.userData)
  const { isLoading } = useAppSelector((state) => state.filenames);

  const navigation = useNavigation();

  const randomBool = useMemo(() => Math.random() < 0.5, []);

  const { collectionsData } = useAppSelector(({ filenames }) => filenames);
  const { collectionCovers } = useAppSelector(({ filenames }) => filenames);
  const { firstName, lastName, username, bio, avatar } = useAppSelector(
    (state) => state.userData.userData
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   //@ts-ignore
  //   dispatch(fetchFilenames());
  //   dispatch(fetchUserData());
  //   console.log("AVATAR?" + avatar?.uri);
  // }, [dispatch]);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchUserData());
    dispatch(fetchFilenames());

    const unsubscribe = navigation.addListener("focus", () => {
      // Fetch updated user data when the screen comes into focus
      // @ts-ignore
      dispatch(fetchUserData());
      dispatch(fetchFilenames());
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, [navigation, dispatch]);

  const formattedData = useMemo(() => {
    if (!collectionCovers) return [];

    return collectionCovers.map((item, index) => {
      const width = Math.floor(Math.random() * 2) + 1;
      const height = Math.floor(Math.random() * 2) + 1;
      const randomBool = Math.random() < 0.5;

      return {
        id: index.toString(),
        ...item,
        width: width,
        height: height,
        randomBool: randomBool,
        key: index,
      };
    });
  }, [collectionCovers]);

  const renderItem = ({ item, index }: any) => {
    // console.log(`INDEX: ${item.key}`);
    // console.log(item.uri);
    // console.log("ITEM:", item);

    if (!item || !item.image || !item.image.uri) {
      // Handle empty or undefined item or item.image case
      console.log("Rendertime NULL hit!");
      return null;
    }
    console.log("rendering");

    return (
      <TouchableOpacity key={item.assetId} style={[{ marginTop: 12, flex: 1 }]}>
        <View
          style={[
            {
              marginLeft: item.index % 2 === 0 ? 0 : 10,
              position: "relative",
            },
          ]}>
          <Image
            source={{ uri: item.image.uri }}
            style={{
              height: item.randomBool ? 150 : 280,
              alignSelf: "stretch",
            }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: 5,
            }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.views}>234 views</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    // }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.navigation}>
        <ProfileMain profilePicture={avatar?.uri} collections={123} fans={50} />
      </View>
      <View style={styles.body}>
        <ScrollView style={{ marginTop: 25 }}>
          {!isLoading && (
            <MasonryList
              data={formattedData}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingHorizontal: 24,
                alignSelf: "stretch",
              }}
              onMomentumScrollEnd={(ev) => {
                const index = Math.floor(
                  ev.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(index);
              }}
            />
          )}
          {isLoading && <Text>Loading...</Text>}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  navigation: {
    flex: 3,
    backgroundColor: "white",
  },
  body: {
    flex: 9,
    justifyContent: "center",
    backgroundColor: "#dedede",
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
    borderColor: "#ccc",
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  coverContainer: {
    width: width,
    marginTop: 70,
  },
  coverImage: {
    marginVertical: 30,
    alignSelf: "center",
    borderRadius: 5,
  },
  title: {
    // fontSize: 17,
    // fontWeight: "700",
    textAlign: "left",
    // fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    // marginLeft: 40,
    marginBottom: 2,
    color: "rgba(255, 255, 255, 0.88)",
  },
  views: {
    // fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 10,
    color: "rgba(255, 255, 255, 0.69)",
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
