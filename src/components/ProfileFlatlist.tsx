import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ProfileCard from "./ProfileCards/ProfileCard";

interface ProfileFlatlist {
  collection_data?: any | undefined;
}

const ProfileFlatlist: React.FC<ProfileFlatlist> = ({ collection_data }) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        pagingEnabled
        data={data}
        numColumns={2}
        vertical
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          <ProfileCard item={item} onTap={() => console.log("card pressed")} />;
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileFlatlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
