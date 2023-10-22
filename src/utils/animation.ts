import { Animated } from "react-native";

/**
 * Animates a label's position and opacity based on the focus state.
 *
 * @param {boolean} focus - Whether the input field is focused or not.
 * @param {Animated.Value} position - The Animated.Value for the position.
 * @param {Animated.Value} opacity - The Animated.Value for the opacity.
 */
export const animateLabel = (
  focus: boolean,
  position: Animated.Value,
  opacity: Animated.Value
) => {
  Animated.parallel([
    Animated.timing(position, {
      toValue: focus ? 0 : 10,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: focus ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();
};
