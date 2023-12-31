import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { useAppSelector } from "../redux_toolkit";
import MediaComponent from "./MediaComponent";

interface ProfileImageCardProps {
  item: any;
}

const ProfileImageCard: React.FC<ProfileImageCardProps> = ({ item }) => {
  const { isLoading } = useAppSelector((state) => state.filenames);

  if (!item || !item.image || !item.image.uri) {
    // Handle empty or undefined item or item.image case
    console.log("Rendertime NULL hit!");
    return null;
  }

  return (
    <View key={item.assetId} style={[{ marginTop: 12, flex: 1 }]}>
      <View
        style={[
          {
            marginLeft: item.index % 2 === 0 ? 0 : 10,
            position: "relative",
          },
        ]}>
        <MediaComponent
          uri={item?.image?.uri}
          type={item.image.type}
          style={{
            height: item.randomBool ? 150 : 280,
            alignSelf: "stretch",
          }}
          resizeMode="cover"
          controls={false}
          muted={true}
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
    </View>
  );
};

export default ProfileImageCard;

const styles = StyleSheet.create({
  title: {
    // fontSize: 17,
    // fontWeight: "700",
    textAlign: "left",
    // fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    // marginLeft: 40,
    marginBottom: 2,
    color: "rgba(255, 255, 255, 0.88)",
  },
  views: {
    // fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 10,
    color: "rgba(255, 255, 255, 0.69)",
  },
});
