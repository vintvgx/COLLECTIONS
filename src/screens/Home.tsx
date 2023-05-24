import { StyleSheet, Text, View } from "react-native";
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

interface ImagesProps {
  OnSetFilenames: Function;
  OnSetCovers: Function;
}

const _Home: React.FC<ImagesProps> = ({ OnSetFilenames }) => {
  const dispatch = useDispatch();
  const filenames = useSelector(selectFilenames);
  const collections = useSelector(selectCollectionData);

  useEffect(() => {
    async function fetch() {
      const result = await dispatch(fetchFilenames());
    }
    fetch();
    console.log("HOME filenames: ", filenames);
    console.log("Collections: ", collections);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ButtonWithTitle
          title="Sign Out"
          height={50}
          width={325}
          onTap={userSignOut}
        />
      </View>
    </View>
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
