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
};

const CollectionFeedViewHeader: React.FC<CollectionFeedViewHeaderProps> = ({
  title,
  headerTitleFade,
  currentItemIndex,
  dataCollectionLength,
  sharedFontColor,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Animated.Text
        style={{ color: sharedFontColor, opacity: headerTitleFade }}>
        {`${currentItemIndex}/${dataCollectionLength}`}
      </Animated.Text>
      <Animated.Text
        style={[styles.header_title_text, { opacity: headerTitleFade }]}>
        {title}
      </Animated.Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="menu" size={20} color="black"></Feather>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: sharedFontColor }}>Done</Text>
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
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 65,
  },
  header_title_text: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default CollectionFeedViewHeader;
