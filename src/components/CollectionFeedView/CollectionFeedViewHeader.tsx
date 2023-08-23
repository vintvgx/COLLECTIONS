import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type CollectionFeedViewHeaderProps = {
  title: string;
  headerTitleFade: any;
  currentItemIndex: number;
  dataCollectionLength: number;
  sharedFontColor: string;
  editButton: boolean;
  onEditPress?: () => void;
};

const CollectionFeedViewHeader: React.FC<CollectionFeedViewHeaderProps> = ({
  title,
  headerTitleFade,
  currentItemIndex,
  dataCollectionLength,
  sharedFontColor,
  editButton,
  onEditPress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: sharedFontColor }}>Back</Text>
        </TouchableOpacity>
        <Animated.Text
          style={{
            color: sharedFontColor,
            opacity: headerTitleFade,
            marginLeft: 3,
          }}>
          {`${currentItemIndex}/${dataCollectionLength}`}
        </Animated.Text>
      </View>
      <Animated.Text
        style={[
          styles.header_title_text,
          { opacity: headerTitleFade, pointerEvents: "none" },
        ]}>
        {title}
      </Animated.Text>
      <View
        style={[
          styles.rightIcons,
          editButton ? {} : { justifyContent: "flex-end" },
        ]}>
        {editButton && (
          <TouchableOpacity onPress={onEditPress}>
            <Text style={{ color: sharedFontColor }}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="menu" size={20} color="black"></Feather>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 65,
  },
  header_title_text: {
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 1,
  },
});

export default CollectionFeedViewHeader;
