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
  isEditButton?: boolean;
  isEditMode?: boolean;
  onEditPress?: () => void;
  onDeletePress?: () => void;
};

const CollectionFeedViewHeader: React.FC<CollectionFeedViewHeaderProps> = ({
  title,
  headerTitleFade,
  currentItemIndex,
  dataCollectionLength,
  sharedFontColor,
  isEditButton,
  isEditMode,
  onEditPress,
  onDeletePress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left Icons */}
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
      {/* Title */}
      <Animated.Text
        style={[
          styles.header_title_text,
          { opacity: headerTitleFade, pointerEvents: "none" },
        ]}>
        {title}
      </Animated.Text>
      {/* Right Icons */}
      <View
        style={[
          styles.rightIcons,
          isEditMode ? styles.rightIconsEditMode : {},
        ]}>
        {isEditMode ? (
          <>
            <TouchableOpacity onPress={onDeletePress}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEditPress}>
              <Text style={{ color: sharedFontColor }}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          isEditButton && (
            <>
              <TouchableOpacity onPress={onEditPress}>
                <Text style={{ color: sharedFontColor }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="menu" size={20} color="black" />
              </TouchableOpacity>
            </>
          )
        )}
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
    minWidth: 55,
  },
  rightIconsEditMode: {
    minWidth: 90,
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
  deleteButton: {
    color: "red",
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

export default CollectionFeedViewHeader;
