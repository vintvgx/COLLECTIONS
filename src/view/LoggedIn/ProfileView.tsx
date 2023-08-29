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
  StatusBar,
} from "react-native";
import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
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
import DropdownMenu from "../../components/ProfileDropDown";

import { EventRegister } from "react-native-event-listeners";
import { useTheme } from "../../theme/themeContext";

const { width } = Dimensions.get("window");

const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useTheme();
  const theme = {
    backgroundColor: darkMode ? "#000" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  //TODO Add username to page & set loading
  // const {isLoading } = useAppSelector((state) => state.userData)
  const { isLoading } = useAppSelector((state) => state.filenames);
  const [formattedData, setFormattedData] = useState<ImageCollectionData[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const { collectionCovers } = useAppSelector(({ filenames }) => filenames);
  const { avatar, username } = useAppSelector(
    (state: any) => state.userData.userData
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldBlurBackground, setShouldBlurBackground] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchFilenames());

    // const unsubscribe = navigation.addListener("focus", () => {
    //   // Fetch updated user data when the screen comes into focus
    //   dispatch(fetchUserData());
    //   dispatch(fetchFilenames());
    // });

    // // Cleanup the listener when the component unmounts
    // return unsubscribe;
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

  const handleImagePress = (imageData: {
    image?: { title?: string; uid?: string };
  }) => {
    if (imageData?.image) {
      navigation.navigate("ProfileCollectionView", {
        title: imageData.image.title,
        uid: imageData.image.uid,
      });
    } else {
      console.error("Invalid imageData:", imageData);
    }
  };

  const handleDropdownToggle = (isVisible: boolean) => {
    setShouldBlurBackground(isVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <StatusBar
        backgroundColor={darkMode ? "#000" : "#fff"}
        barStyle={darkMode ? "light-content" : "dark-content"}
      />
      <View
        style={[styles.navigation, { backgroundColor: theme.backgroundColor }]}>
        <Image source={{ uri: avatar?.uri }} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: theme.color }]}>
            {username}
          </Text>
          <View style={styles.userStats}>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: theme.color }]}>
                {collectionCovers?.length}
              </Text>
              <Text style={styles.statLabel}>Collections</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: theme.color }]}>
                123
              </Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
          </View>
        </View>

        <View style={styles.signOutButtonContainer}>
          <DropdownMenu
            onNavigateToProfileSettings={() => {
              navigation.navigate("ProfileSettings");
            }}
            onSignOut={signOutUser}
            onToggle={handleDropdownToggle}
          />
        </View>
      </View>
      {username && <Text style={styles.bio}>{username}</Text>}
      <View style={styles.body}>
        <ScrollView
          style={{ marginTop: 16, backgroundColor: theme.backgroundColor }}>
          {!isLoading && (
            <MasonryList
              data={formattedData}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    handleImagePress({
                      image: { title: item.title, uid: item.image.uid },
                    })
                  }>
                  <ProfileImageCard item={item} />
                </TouchableOpacity>
              )}
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
  // signOutButtonContainer: {
  //   position: "absolute",
  //   top: 10,
  //   right: 10,
  //   zIndex: 10,
  // },
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
  blurringOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9,
  },
  signOutButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
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
