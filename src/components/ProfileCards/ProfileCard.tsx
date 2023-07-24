import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { ImageCollectionData } from "../../model/types";

interface ProfileCardProps {
  item: ImageCollectionData;
  onTap: Function;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onTap }) => {
  return (
    <View style={styles.fl_container}>
      <TouchableOpacity
        // onPress={() => handlePress(item)}
        // onLongPress={handleLongPress}
        onPress={() => onTap(item)}>
        <Image source={{ uri: item.imgUri }} style={styles.fl_image} />
        {/* <Image source={item.image} style={styles.fl_image} /> */}
        <View style={styles.fl_image_detail}>
          {/* <Text>{longPress ? item.title : ""}</Text> */}
          <Text>{item.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  fl_container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: Dimensions.get("window").width / 2.4,
    height: Dimensions.get("window").width / 2.4,
    padding: 0,
    margin: 15,
    marginTop: 30,
    // overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    // backgroundColor: "white",
  },
  fl_image: {
    // flex:1,
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    // borderWidth: 2,
    // borderColor: "#d35647",
    zIndex: -1,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
  },
  fl_image_detail: {
    position: "absolute",
    top: "50%",
    zIndex: 1,
    alignSelf: "center",
  },
  font: {
    fontSize: 25,
    color: "#000",
    fontFamily: "Arial",
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: "auto",
    alignSelf: "center",
    opacity: 1,
  },
});
