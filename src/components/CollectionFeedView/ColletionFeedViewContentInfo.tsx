import { Animated, View, Text, Image, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { sharedFontColor, sharedBackgroundColor } from "../../utils/global";

type CollectionFeedViewContentInfoProps = {
  headerHeight: Animated.AnimatedInterpolation<number>;
  titleOpacity: Animated.AnimatedInterpolation<number>;
  titleMarginLeft: Animated.AnimatedInterpolation<number>;
  title: string;
  createdAt?: string;
  description: string;
  avatarUri: string | undefined;
  username: string;
  isEditMode?: boolean;
  onDescriptionChange?: (newDescription: string) => void;
};

const CollectionFeedViewContentInfo: React.FC<
  CollectionFeedViewContentInfoProps
> = ({
  headerHeight,
  titleOpacity,
  titleMarginLeft,
  title,
  createdAt,
  description,
  avatarUri,
  username,
  isEditMode,
  onDescriptionChange,
}) => {
  const shadowOpacity = headerHeight.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 0.3],
    extrapolate: "clamp",
  });

  const shadowRadius = headerHeight.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 4],
    extrapolate: "clamp",
  });

  const elevation = headerHeight.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.contentDetails,
        {
          height: headerHeight,
          backgroundColor: sharedBackgroundColor,
          shadowOpacity: shadowOpacity,
          shadowRadius: shadowRadius,
          elevation: elevation,
        },
      ]}>
      <Animated.View style={styles.leftSide}>
        <Animated.Text
          style={[
            styles.title_text,
            { opacity: titleOpacity, marginLeft: titleMarginLeft },
          ]}>
          {title}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.details_text,
            { opacity: titleOpacity, marginLeft: titleMarginLeft },
          ]}>
          {createdAt}
        </Animated.Text>
        {isEditMode ? (
          <Animated.View style={styles.editModeWrapper}>
            <TextInput
              value={description}
              onChangeText={onDescriptionChange}
              style={styles.descriptionInput}
              placeholder="Edit description..."
              multiline
              numberOfLines={3}
            />
            <Text style={styles.editModeText}>Editing</Text>
          </Animated.View>
        ) : (
          <Animated.Text
            style={[
              styles.details_text,
              { opacity: titleOpacity, marginLeft: titleMarginLeft },
            ]}>
            {description}
          </Animated.Text>
        )}
      </Animated.View>
      <Animated.View style={styles.rightSide}>
        <Animated.Image
          source={{ uri: avatarUri }}
          style={[
            styles.avatarImage,
            { opacity: titleOpacity, marginLeft: titleMarginLeft },
          ]}
        />
        <Animated.Text
          style={[
            styles.username_text,
            { opacity: titleOpacity, marginLeft: titleMarginLeft },
          ]}>
          {username}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default CollectionFeedViewContentInfo;

const styles = StyleSheet.create({
  contentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: sharedFontColor,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
  },
  leftSide: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "70%",
  },
  rightSide: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    // flexDirection: "row",
  },
  title_text: {
    fontSize: 26,
    fontWeight: "bold",
    color: sharedFontColor,
    marginBottom: 4,
  },
  details_text: {
    fontSize: 14,
    color: sharedFontColor,
    marginBottom: 2,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 20, // Circular image
    marginRight: 10,
  },
  username_text: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
  },
  editModeWrapper: {
    backgroundColor: "#f8f9fa", // Slightly lighter gray
    borderRadius: 10, // Updated radius
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ced4da", // Updated border color
    borderRadius: 10, // Updated radius
    padding: 10,
  },
  editModeText: {
    color: "#adb5bd", // Light gray text
    fontSize: 12,
    marginLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Shadow color
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
