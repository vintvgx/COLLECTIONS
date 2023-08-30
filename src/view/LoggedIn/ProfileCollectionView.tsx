import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  ViewToken,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import React, { useEffect, useRef, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  fetchProfileCollection,
  updateProfileCollectionAction,
} from "../../redux_toolkit/slices";
import { AppDispatch, RootState } from "../../redux_toolkit";

//components
import CollectionFeedViewHeader from "../../components/CollectionFeedView/CollectionFeedViewHeader";
import CollectionFeedViewSplashScreen from "../../components/CollectionFeedView/CollectionFeedViewSplashScreen";
import CollectionFeedViewRenderItem from "../../components/CollectionFeedView/CollectionFeedViewRenderItem";

//functions
import {
  getHeaderHeight,
  getTitleOpacity,
  getHeaderTitleFade,
  getTitleMarginLeft,
} from "../../utils/functions";
import CollectionFeedViewController from "../../controller/CollectionFeedViewController";
import CollectionFeedViewContentInfo from "../../components/CollectionFeedView/ColletionFeedViewContentInfo";
import { RootStackParams } from "../../navigation/Navigation";
import { ImageCollectionData } from "../../model/types";
import EditProfileCollectionView from "../../components/CollectionFeedView/EditProfileCollectionView";
import CollectionFlatListView from "../../components/CollectionFeedView/CollectionFlatListView";

const sharedBackgroundColor = "white";
const sharedFontColor = "black";

type ProfileCollectionFeedViewProps = {
  route: RouteProp<RootStackParams, "ProfileCollectionView">;
};

const ProfileCollectionView: React.FC<ProfileCollectionFeedViewProps> = ({
  route,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const { title, uid } = route.params;
  const profileCollection = useSelector(
    (state: RootState) => state.filenames.profileCollection
  );
  const userData = useSelector((state: RootState) => state.feed.userData);

  const [showTitle, setShowTitle] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [description, setDescription] = useState(
    "This section contains the collection description."
  );
  const [sortedData, setSortedData] = useState<ImageCollectionData[]>([]);

  const scrollY = new Animated.Value(0);
  const headerHeight = getHeaderHeight(scrollY);
  const titleOpacity = getTitleOpacity(scrollY);
  const headerTitleFade = getHeaderTitleFade(scrollY);
  const titleMarginLeft = getTitleMarginLeft(scrollY);

  useEffect(() => {
    const fetchCollectionAsync = async () => {
      try {
        await dispatch(fetchProfileCollection(uid, title));
      } catch (error) {
        await console.error("Error fetching profile collection:", error);
      }
    };

    fetchCollectionAsync();
  }, [dispatch, uid, title]);

  // Add another useEffect to sort the data when profileCollection changes
  useEffect(() => {
    if (profileCollection) {
      const sorted = [...profileCollection].sort(
        (a, b) => a.image.id - b.image.id
      );
      setSortedData(sorted);
    }
  }, [profileCollection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onViewableItemsChanged = useRef(
    CollectionFeedViewController.viewableItemsChanged(setCurrentItemIndex)
  ).current;

  const screenWidth = Dimensions.get("window").width;
  const imageDimension = screenWidth / 4 - 8; // Subtracting for margin and any possible padding.

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={sharedBackgroundColor}
        barStyle="dark-content"
      />
      {showTitle ? (
        <CollectionFeedViewSplashScreen title={title} userData={userData} />
      ) : (
        <View>
          <CollectionFeedViewHeader
            title={title}
            headerTitleFade={headerTitleFade}
            currentItemIndex={currentItemIndex}
            dataCollectionLength={profileCollection?.length || 0}
            sharedFontColor={sharedFontColor}
            isEditButton={true}
            isEditMode={isEditMode}
            onEditPress={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) {
                //TODO handle dispatching new array / descripton change to firebase
                dispatch(
                  updateProfileCollectionAction({
                    uid,
                    title,
                    updatedData: sortedData,
                    updatedDescription: description,
                  })
                )
                  .then(() => {
                    console.log("SAVED");
                  })
                  .catch((error) => {
                    console.log("Error:", error);
                  });
              }
            }}
          />
          <CollectionFeedViewContentInfo
            headerHeight={headerHeight}
            titleOpacity={titleOpacity}
            titleMarginLeft={titleMarginLeft}
            title={title}
            description={description}
            avatarUri={userData?.avatar.uri || ""}
            username={userData?.username || "N/A"}
            isEditMode={isEditMode}
            onDescriptionChange={(newDescription) =>
              setDescription(newDescription)
            } // To update the description
          />
          {isEditMode ? (
            <EditProfileCollectionView
              data={sortedData}
              scrollY={scrollY}
              onViewableItemsChanged={onViewableItemsChanged}
              onOrderChanged={(newOrder) => {
                // Update the sortedData state or take some other action
                setSortedData(newOrder);
              }}
            />
          ) : (
            <CollectionFlatListView
              data={sortedData}
              scrollY={scrollY}
              onViewableItemsChanged={onViewableItemsChanged}
            />
          )}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Username: {userData?.username}
            </Text>
            <Text style={styles.footerText}>
              Created At: {sortedData[0]?.createdAt}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileCollectionView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  footer: {
    padding: 16,
    backgroundColor: "transparent",
  },
  footerText: {
    fontSize: 12,
    color: "lightgray",
  },
});
