import React from "react";
import { View, StyleSheet, Animated } from "react-native";

const FeedSkeletonView = () => {
  const animatedValue = new Animated.Value(0);

  // Animation configuration
  const shimmerAnimation = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => shimmerAnimation());
  };

  React.useEffect(() => {
    shimmerAnimation();
  }, []);

  // Interpolate the animated value for shimmer effect
  const shimmerTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300], // Adjust the range based on your UI design
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX: shimmerTranslate }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  shimmer: {
    backgroundColor: "#f4f4f4", // Replace with your preferred shimmer color
    height: 10, // Adjust the height based on your UI design
    borderRadius: 5, // Adjust the border radius based on your UI design
    marginVertical: 6,
  },
});

export default FeedSkeletonView;
