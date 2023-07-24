import React, { useEffect, useState, memo } from "react";
import {
  Image,
  ImageStyle,
  ImageURISource,
  ImageResizeMode,
} from "react-native";
import CachedImage from "expo-cached-image";

interface CachedImageProps {
  source: Omit<ImageURISource, "uri"> & { uri: string };
  cacheKey: string;
  onCache?: () => void;
  style?: ImageStyle;
  resizeMode?: ImageResizeMode;
}

const CustomCachedImage: React.FC<CachedImageProps> = ({
  source,
  cacheKey,
  onCache,
  style,
  resizeMode,
}) => {
  const [isImageCached, setIsImageCached] = useState(false);

  useEffect(() => {
    const checkCache = async () => {
      try {
        await Image.prefetch(source.uri);
        setIsImageCached(true);
        onCache && onCache();
      } catch (error) {
        console.log("Error caching image:", error);
      }
    };

    if (!isImageCached) {
      checkCache();
    }
  }, [source, cacheKey, isImageCached, onCache]);

  return (
    <CachedImage
      source={source}
      cacheKey={cacheKey}
      style={style}
      resizeMode={resizeMode}
    />
  );
};

export default memo(CustomCachedImage);
