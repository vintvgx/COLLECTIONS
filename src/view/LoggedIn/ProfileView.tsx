import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef, useMemo } from "react";
import MasonryList from "@react-native-seoul/masonry-list";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "../../redux_toolkit";
import { fetchFilenames } from "../../redux_toolkit/slices/filenameSlice";
import { fetchUserData } from "../../redux_toolkit/slices/user_data";

import ProfileMain from "../../components/ProfileMAIN";
import ProfileImageCard from "../../components/ProfileImageCard";
import ProfileController from "../../controller/ProfileController";

const { width } = Dimensions.get("window");

const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch();

  //TODO Add username to page & set loading
  // const {isLoading } = useAppSelector((state) => state.userData)
  const { isLoading } = useAppSelector((state) => state.filenames);
  const [formattedData, setFormattedData] = useState([]);

  const navigation = useNavigation();

  const { collectionCovers } = useAppSelector(({ filenames }) => filenames);
  const { avatar } = useAppSelector((state) => state.userData.userData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchFilenames());

    const unsubscribe = navigation.addListener("focus", () => {
      // Fetch updated user data when the screen comes into focus
      dispatch(fetchUserData());
      dispatch(fetchFilenames());
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    async function fetchCollectionCovers() {
      await ProfileController.setImageHeightAndWeight(collectionCovers);
      console.log("FORMAT", formattedData);

      setFormattedData(formattedData);
    }

    fetchCollectionCovers();
  }, []);

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
              renderItem={({ item }) => <ProfileImageCard item={item} />}
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

export default ProfileView;

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
