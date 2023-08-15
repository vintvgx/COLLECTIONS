import { Animated } from "react-native";
import { StyleSheet } from "react-native";
import { sharedFontColor, sharedBackgroundColor } from "../../utils/global";

type CollectionFeedViewContentInfoProps = {
  headerHeight: Animated.AnimatedInterpolation<number>;
  titleOpacity: Animated.AnimatedInterpolation<number>;
  titleMarginLeft: Animated.AnimatedInterpolation<number>;
  title: string;
};

const CollectionFeedViewContentInfo: React.FC<
  CollectionFeedViewContentInfoProps
> = ({ headerHeight, titleOpacity, titleMarginLeft, title }) => {
  return (
    <Animated.View
      style={[
        styles.contentDetails,
        {
          height: headerHeight,
          backgroundColor: sharedBackgroundColor,
        },
      ]}>
      <Animated.Text
        style={[
          styles.title_text,
          { opacity: titleOpacity, marginLeft: titleMarginLeft },
        ]}>
        {title}
      </Animated.Text>
    </Animated.View>
  );
};

export default CollectionFeedViewContentInfo;

const styles = StyleSheet.create({
  contentDetails: {
    alignItems: "flex-start",
    justifyContent: "center",
    color: sharedFontColor,
  },
  title_text: {
    fontSize: 30,
    fontWeight: "bold",
    color: sharedFontColor,
  },
});
