import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux_toolkit";
import CustomCachedImage from "../components/CustomCachedImage";
import { calculateImageHeight } from "../utils/image";

interface RenderItemProps {
  item: any;
}

const RenderItem: React.FC<RenderItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const isLoading = useAppSelector((state) => state.feed.isLoading);

  const calculatedHeight = calculateImageHeight(
    item.image.width,
    item.image.height
  );
  const imageUrl = item.image.uri;
  const cacheKey = `feed-cache-data-${imageUrl}`;

  const { firstName, lastName, username, bio, avatar } = useAppSelector(
    (state) => state.userData.userData
  );

  //   if (isLoading) {
  //     return (
  //       <View style={styles.loadingContainer}>
  //         <Text>Loading</Text>
  //       </View>
  //     );
  //   }

  return (
    <View>
      <View style={styles.collectionCard}>
        <TouchableOpacity onPress={() => console.log(item)}>
          <CustomCachedImage
            source={{ uri: item.image.uri }}
            cacheKey={cacheKey}
            style={{
              flex: 1,
              height: calculatedHeight,
              alignSelf: "stretch",
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ marginTop: 8, marginLeft: 5 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.views}>234 views</Text>
          </View>

          <View
            ///TODO align contents to be placaed both in the vertically centered
            style={{
              flexDirection: "row",
              marginRight: 5,
              alignItems: "center",
            }}>
            {/* <ProfileMain profilePicture={avatar?.uri} collections={123} fans={50} /> */}
            <Text style={{ color: "#777F88" }}>{username}</Text>
            <TouchableOpacity style={styles.circle}>
              {/* <Image
                    source={{ uri: avatar.uri }}
                    style={styles.profileImage}
                  /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Set an appropriate height while loading
  },
  // Rest of your styles
  collectionCard: {
    flex: 1,
    marginBottom: 75,
  },
  title: {
    // fontFamily: "Arial Black",
    fontSize: 26,
    fontWeight: "700",
  },
  views: {
    fontSize: 15,
    color: "#777F88",
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    // marginBottom: 10,
    // marginTop: 15,
  },
});

export default RenderItem;
