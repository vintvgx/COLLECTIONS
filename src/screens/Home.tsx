import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
import { ImageCollectionData } from "../utils/types";
import { useAppSelector } from "../redux_toolkit";

import { fetchFeedData } from "../redux_toolkit/slices/retrieveFeedSlice";

interface ImagesProps {
  OnSetFilenames: Function;
  OnSetCovers: Function;
}

interface FeedProps {
  data: ImageCollectionData[];
}

const _Home: React.FC<FeedProps> = ({ data }) => {
  const dispatch = useDispatch();

  const { feedData } = useAppSelector(({ feed }) => feed);
  const { feedCollectionCovers } = useAppSelector(({ feed }) => feed);

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchFeedData());
    console.log("FEEED", feedData);
  }, [dispatch]);
  // const filenames = useSelector(selectFilenames);
  // const collections = useSelector(selectCollectionData);

  // useEffect(() => {
  //   async function fetch() {
  //     const result = await dispatch(fetchFilenames());
  //   }
  //   fetch();
  //   console.log("HOME filenames: ", filenames);
  //   console.log("Collections: ", collections);
  // }, [dispatch]);

  const renderItem = ({ item, index }: any) => {
    // console.log(`INDEX: ${item.key}`);
    // console.log(item.uri);
    // console.log("ITEM:", item);
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
    <ScrollView style={styles.container}>
      <View>
        <FlatList data={feedCollectionCovers} renderItem={renderItem} />
      </View>
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
});

const mapStateToProps = (state: ApplicationState) => ({
  imagesReducer: state.imagesReducer,
});

const HomeScreen = connect(mapStateToProps, { OnSetFilenames })(_Home);

export { HomeScreen };
