import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import CreateController from "../../controller/CreateController";
import { ImageData } from "../../model/types";
import { useDispatch } from "react-redux";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AddCollectionViewProps = {
  route: RouteProp<RootStackParams, "AddCollectionView">;
};

const AddCollectionView: React.FC<AddCollectionViewProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const { images } = route.params;
  const [cover, setCover] = useState("");

  const [imageList, setImageList] = useState(images);
  const [showModal, setShowModal] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const currentDateTime = new Date();
  const currentTimestamp = new Date().toISOString();

  useEffect(() => {
    if (images && images.length > 0) {
      setCover(images[0].uri);
    }
  }, []);

  const reorderArray = (
    list: ImageData[],
    fromIndex: number,
    toIndex: number
  ): ImageData[] => {
    const result = Array.from(list);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  const handleDragEnd = ({ from, to }: { from: number; to: number }) => {
    const reorderedList = reorderArray(imageList, from, to);
    setImageList(reorderedList);
  };

  const handleConfirmButtonPressed = async () => {
    await CreateController.HANDLE_CONFIRM_BUTTON_PRESSED(
      imageList,
      collectionTitle,
      setCollectionTitle,
      setImageCount,
      setShowModal,
      currentTimestamp,
      dispatch
    );
    navigation.goBack();
  };

  const handleSaveButtonPress = () => {
    CreateController.HANDLE_SAVE_BUTTON_PRESSED(
      imageList,
      setCollectionTitle,
      setImageCount,
      setShowModal
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => CreateController.HANDLE_BACK_BUTTON_PRESSED(navigation)}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSaveButtonPress}
        style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: cover }}
          style={styles.cover_image}
          onError={(error) => console.log(error)}
        />
      </View>
      <View>
        <DraggableFlatList
          data={imageList}
          renderItem={({
            item,
            drag,
            isActive,
          }: {
            item: ImageData;
            drag: () => void;
            isActive: boolean;
          }) => (
            <TouchableOpacity
              onLongPress={drag} // Activate the drag when item is long pressed.
              onPress={() => {
                setCover(item.uri);
              }}
              style={[
                styles.flatlist_container,
                isActive ? { backgroundColor: "lightgray" } : {},
              ]}>
              <Image source={{ uri: item.uri }} style={styles.flatlist_image} />
            </TouchableOpacity>
          )}
          keyExtractor={(item: { uri: string }) => item.uri}
          horizontal
          onDragEnd={handleDragEnd}
        />
      </View>
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Added cover image and TextInput in the modal */}
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: imageList[0].uri }}
                style={styles.modalCoverImage}
                onError={(error) => console.log(error)}
              />
              <TextInput
                style={styles.titleInput}
                placeholder="Title Collection"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={collectionTitle}
                onChangeText={setCollectionTitle}
              />
            </View>

            <Text style={styles.modalSubtitle}>Image Count: {imageCount}</Text>
            <Text style={styles.modalSubtitle}>
              Created At: {new Date(currentDateTime).toLocaleString()}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmButtonPressed}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist_container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: Dimensions.get("window").width / 4.5,
    height: Dimensions.get("window").height / 10,
    padding: 0,
    margin: 5,
    marginTop: 30,
    overflow: "hidden",
  },
  flatlist_image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    // borderWidth:2,
    // borderColor:'#d35647',
    zIndex: -1,
  },
  cover_image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    aspectRatio: 1,
    resizeMode: "contain",
    alignSelf: "center",
  },
  titleInput: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: "80%", // Adjust as needed
    backgroundColor: "rgba(0,0,0,0.3)", // Slight transparent black background for readability
    padding: 8,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    //TODO: Add blur effect to background
    // backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 4,
    borderRadius: 10,
    elevation: 5,
    width: "70%",
    height: "auto",
  },
  coverContainer: {
    width: "100%",
    height: 200, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Space after the cover
    alignSelf: "center",
  },
  modalCoverImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10, // To round the corners
    marginTop: 10, // To add 10px of margin from the top
    marginLeft: 10, // To add 10px of margin from the left
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14, // increased font size for better readability
    marginBottom: 5,
    color: "#212121", // changed text color to a dark gray
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20, // Place it to the left of the screen
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0", // changed background color to a light gray
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: "lightgray", // added a light gray border
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "#212121", // changed text color to a dark gray
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50", // changed background color to a green
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#388E3C", // changed border color to a darker green
  },

  confirmButtonText: {
    color: "white", // unchanged
  },
});

export default AddCollectionView;
