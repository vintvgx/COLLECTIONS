import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import MasonryList from "@react-native-seoul/masonry-list";

/** //TODO
 * COPY TO PROFILE TO CONVERT OBJECT TO ARRAY
 * 
 * const masonryData = collectionCovers?.map((item) => ({
    uri: item.imgUri,
    title: item.title,
    data: item.images,
  }));
 * 
 */

interface MasonryProps {
  masonryData: [];
}

const MasonryListView: React.FC<MasonryProps> = ({ masonryData }) => {
  const renderItem = ({ item }: { item: any }) => {
    console.log("item:", item);
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: item.uri }}
          style={{ height: undefined, borderRadius: 8 }}
        />
      </View>
    );
  };

  return (
    <View>
      <MasonryList
        data={masonryData || []}
        // spacing={8}
        numColumns={2}
        // onEndReached={onEndReached}
        // renderIndividualHeader={(data) => <Text>{data.id}</Text>}
        // onPressImage={(data) => console.log(data)}
        // renderIndividualFooter={(data) => <Text>{data.width}x{data.height}</Text>}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MasonryListView;

const styles = StyleSheet.create({});
