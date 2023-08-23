import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  ViewToken,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux_toolkit";
import { useDispatch } from "react-redux";

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

const sharedBackgroundColor = "white";
const sharedFontColor = "black";

type CollectionFeedViewProps = {
  route: RouteProp<RootStackParams, "CollectionFeedView">;
};

const CollectionFeedView: React.FC<CollectionFeedViewProps> = ({ route }) => {
  const dispatch: AppDispatch = useDispatch();

  const { title, uid } = route.params;
  const dataCollection = useSelector(
    (state: RootState) => state.feed.collectionsData
  );
  const userData = useSelector((state: RootState) => state.feed.userData);

  const [showTitle, setShowTitle] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(1);

  const scrollY = new Animated.Value(0);
  const headerHeight = getHeaderHeight(scrollY);
  const titleOpacity = getTitleOpacity(scrollY);
  const headerTitleFade = getHeaderTitleFade(scrollY);
  const titleMarginLeft = getTitleMarginLeft(scrollY);

  useEffect(() => {
    CollectionFeedViewController.fetchCollection(dispatch, title, uid);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onViewableItemsChanged = useRef(
    CollectionFeedViewController.viewableItemsChanged(setCurrentItemIndex)
  ).current;

  const sortedData = dataCollection
    ? [...dataCollection].sort((a, b) => a.image.id - b.image.id)
    : [];

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
            dataCollectionLength={dataCollection?.length || 0}
            sharedFontColor={sharedFontColor}
            editButton={false}
          />
          <CollectionFeedViewContentInfo
            headerHeight={headerHeight}
            titleOpacity={titleOpacity}
            titleMarginLeft={titleMarginLeft}
            title={title}
            // createdAt={
            //   sortedData[0].createdAt
            //     ? CollectionFeedViewController.formatDate(
            //         sortedData[0].createdAt
            //       )
            //     : "N/A"
            // }
            description={"This section contains the collection description."} // Make sure to provide the description here
            avatarUri={userData?.avatar.uri || ""}
            username={userData?.username || "N/A"}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50, // adjust this value as needed
            }}
            data={sortedData}
            renderItem={({ item }) => (
              <CollectionFeedViewRenderItem item={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false } // Make sure to set this to false
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Username: {userData?.username}
            </Text>
            <Text style={styles.footerText}>
              Created At: {sortedData[0].createdAt}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CollectionFeedView;

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
