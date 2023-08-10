import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux_toolkit";
import { useDispatch } from "react-redux";
import { fetchCollectionData } from "../../redux_toolkit/slices/retrieveFeedSlice";

// Define your Stack Navigator Param List
type RootStackParamList = {
  CollectionFeedView: {
    title: string;
    uid: string;
  };
  // Other Screens...
};

type CollectionFeedViewProps = {
  route: RouteProp<RootStackParams, "CollectionFeedView">;
};

const CollectionFeedView: React.FC<CollectionFeedViewProps> = ({ route }) => {
  const dispatch: AppDispatch = useDispatch();
  const { title, uid } = route.params;
  const collectionData = useSelector(
    (state: RootState) => state.feed.collectionsData
  );
  const userData = useSelector((state: RootState) => state.feed.userData);

  //   console.log(`IMAGE TITTLE ${title} & USER UID ${uid}`);

  useEffect(() => {
    try {
      dispatch(fetchCollectionData({ title, uid }));
    } catch (error) {
      console.log(error);
    }
    console.log(`${collectionData?.title} + ${userData?.username}`);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text>{uid}</Text>
    </SafeAreaView>
  );
};

export default CollectionFeedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
});
