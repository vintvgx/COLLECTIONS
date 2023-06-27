import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
import { userSignOut } from "../firebase/f9_config";
import { ApplicationState, OnSetFilenames, OnSetCovers } from "../redux";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilenames,
  selectCollectionData,
  selectFilenames,
} from "../redux_toolkit/slices/filenameSlice";

import FastImage from "react-native-fast-image";
import { ImageCollectionData } from "../utils/types";
import { useAppSelector } from "../redux_toolkit";

import {
  fetchFeedData,
  setFeedCollectionCovers,
  setFeedData,
} from "../redux_toolkit/slices/retrieveFeedSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { connectStorageEmulator } from "firebase/storage";
import ProfileMain from "../components/ProfileMAIN";

interface ImagesProps {
  OnSetFilenames: Function;
  OnSetCovers: Function;
}

interface FeedProps {
  data: ImageCollectionData[];
}

let cachedFeedData: any[] | null = null;

const _Home: React.FC<FeedProps> = ({ data }) => {
  const dispatch = useDispatch();

  const { feedData } = useAppSelector(({ feed }) => feed);
  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);

  useEffect(() => {
    if (cachedFeedData) {
      dispatch(setFeedData(cachedFeedData));
      dispatch(
        setFeedCollectionCovers(
          cachedFeedData.map((collection) => collection[0])
        )
      );
    } else {
      //@ts-ignore
      dispatch(fetchFeedData());
    }
  }, [dispatch]);

  // ...

  useEffect(() => {
    if (feedData) {
      cachedFeedData = feedData;
    }
  }, [feedData]);

  const calculateImageHeight = (
    imageWidth: number,
    imageHeight: number
  ): number => {
    const screenWidth = Dimensions.get("window").width;
    const aspectRatio = imageWidth / imageHeight;
    return screenWidth / aspectRatio;
  };

  const renderItem = ({ item, index }: any) => {
    const calculatedHeight = calculateImageHeight(
      item.image.width,
      item.image.height
    );
    console.log(calculatedHeight);

    return (
      <View
        key={item.assetId}
        style={[{ marginTop: 12, flex: 1 }]}
        style={{ margin: 10 }}>
        <View>
          <View style={styles.collectionCard}>
            <TouchableOpacity
              onPress={() => {
                console.log(item);
              }}>
              <Image // Use FastImage instead of Image
                source={{ uri: item.image.uri }}
                style={{
                  flex: 1,
                  // width: undefined,
                  height: calculatedHeight,
                  alignSelf: "stretch",
                }}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.views}>234 views</Text>
              </View>

              <View style={styles.navigation}>
                {/* <ProfileMain profilePicture={avatar?.uri} collections={123} fans={50} /> */}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
    // }
  };

  return (
    <ScrollView style={styles.container}>
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

        <FlatList data={feedCollectionCovers} renderItem={renderItem} />
      </SafeAreaView>
      <View style={styles.body}>
        <ButtonWithTitle
          title="Sign Out"
          height={50}
          width={325}
          onTap={userSignOut}
        />
      </View>
    </ScrollView>
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
    marginBottom: 50,
  },
  title: {
    // fontFamily: "Arial Black",
    fontSize: 26,
    fontWeight: "500",
  },
  views: {
    fontSize: 15,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  imagesReducer: state.imagesReducer,
});

const HomeScreen = connect(mapStateToProps, { OnSetFilenames })(_Home);

export { HomeScreen };
