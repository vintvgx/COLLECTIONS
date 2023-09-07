import React from "react";
import { Image, ImageStyle, StyleProp, ViewStyle } from "react-native";
import { Video } from "expo-av"; // Replace with your actual video library import

interface MediaComponentProps {
  type: "image" | "video" | string | undefined;
  uri: string | undefined;
  style: StyleProp<ViewStyle> | StyleProp<ImageStyle>;
  controls: boolean;
  play: boolean | undefined;
  muted?: boolean;
}

const MediaComponent: React.FC<MediaComponentProps> = ({
  type,
  uri,
  style,
  controls,
  play,
  muted,
}) => {
  return type === "image" ? (
    <Image source={{ uri }} style={style as StyleProp<ImageStyle>} />
  ) : (
    <Video
      source={{ uri }}
      style={style}
      rate={1.0}
      volume={1.0}
      isMuted={muted}
      resizeMode="cover"
      shouldPlay={play}
      isLooping
      useNativeControls={controls}
    />
  );
};

export default MediaComponent;
