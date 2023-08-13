import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { UserData } from "../../model/types";
import { sharedFontColor } from "../../utils/global";

type CollectionFeedViewSplashScreenProps = {
  title: string;
  userData: UserData | null;
};

const CollectionFeedViewSplashScreen: React.FC<
  CollectionFeedViewSplashScreenProps
> = ({ title, userData }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text style={styles.title_text}>{title}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}>
        <Image
          source={{ uri: userData?.avatar.uri }}
          style={styles.profileImage}
        />
        <Text style={styles.username_text}>{userData?.username}</Text>
      </View>
    </View>
  );
};

export default CollectionFeedViewSplashScreen;

const styles = StyleSheet.create({
  title_text: {
    fontSize: 30,
    fontWeight: "bold",
    color: sharedFontColor,

    // textAlign: "left", // align left within Text component
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 45,
    // flex: 1,
    resizeMode: "cover",
    marginRight: 10,
  },
  username_text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    // textAlign: "left", // align left within Text component
  },
});
