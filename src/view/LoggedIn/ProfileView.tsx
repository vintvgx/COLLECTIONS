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
import { ImageCollectionData } from "../../model/types";
import { logFeedData } from "../../utils/functions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/Navigation";
import { auth } from "../../utils/firebase/f9_config";

const { width } = Dimensions.get("window");

const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch();

  //TODO Add username to page & set loading
  // const {isLoading } = useAppSelector((state) => state.userData)
  const { isLoading } = useAppSelector((state) => state.filenames);
  const [formattedData, setFormattedData] = useState<ImageCollectionData[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const { collectionCovers } = useAppSelector(({ filenames }) => filenames);
  const { avatar, username } = useAppSelector(
    (state) => state.userData.userData
  );
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
      const covers = await ProfileController.setImageHeightAndWeight(
        collectionCovers
      );
      setFormattedData(covers);
    }

    fetchCollectionCovers();
  }, [collectionCovers]);

  const signOutUser = async () => {
    try {
      await auth.signOut();
      console.log("User signed out!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.navigation}>
        <Image source={{ uri: avatar?.uri }} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.userStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{collectionCovers?.length}</Text>
              <Text style={styles.statLabel}>Collections</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>123</Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
          </View>
        </View>
        <View style={styles.signOutButtonContainer}>
          <TouchableOpacity onPress={signOutUser} style={styles.signOutButton}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      {username && <Text style={styles.bio}>{username}</Text>}
      <View style={styles.body}>
        <ScrollView style={{ marginTop: 16 }}>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  signOutButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "#FF6347",
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  body: {
    flex: 9,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  coverContainer: {
    width: (width - 48) / 3,
    marginBottom: 8,
  },
  coverImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userStats: {
    flexDirection: "row",
  },
  stat: {
    marginRight: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  bio: {
    padding: 16,
    fontSize: 14,
    color: "#555",
  },
});
