import React from "react";
import { View, Image } from "react-native";

interface Props {
  imageUrl: string;
}

const AddToCollectionButton: React.FC<Props> = ({ imageUrl }) => {
  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <Image
        source={require(`../images/${imageUrl}`)}
        alt="Image"
        style={{ marginRight: "10px" }}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#EEEEEE",
        }}>
        <span style={{ textAlign: "center" }}>Add to Collection</span>
      </View>
    </View>
  );
};

export default AddToCollectionButton;
flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',