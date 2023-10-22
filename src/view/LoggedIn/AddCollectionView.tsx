import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import CreateController from "../../controller/CreateController";
import { ImageData } from "../../model/types";
import { useDispatch } from "react-redux";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { logFeedData } from "../../utils/functions";
import MediaComponent from "../../components/MediaComponent";

type AddCollectionViewProps = {
  route: RouteProp<RootStackParams, "AddCollectionView">;
};

const AddCollectionView: React.FC<AddCollectionViewProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const { images } = route.params;
  const [cover, setCover] = useState<ImageData | undefined>(undefined);

  const [imageList, setImageList] = useState(images);
  const [showModal, setShowModal] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [editorialText, setEditorialText] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const currentDateTime = new Date();
  const currentTimestamp = new Date().toISOString();

  useEffect(() => {
    if (images && images.length > 0) {
      setCover(images[0]);
    }
    logFeedData(images);
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
      editorialText,
      setCollectionTitle,
      setImageCount,
      setShowModal,
      setEditorialText,
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
      <View style={{ flex: 8 / 9 }}>
        <MediaComponent
          uri={cover?.uri}
          type={cover?.type}
          style={styles.flatlist_image}
          controls={true}
          play={true}
        />
      </View>
      <View
        style={{
          flex: 1 / 9,
          backgroundColor: "black",
          width: "auto",
          padding: 10,
        }}>
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
                setCover(item);
              }}
              style={[
                styles.flatlist_container,
                isActive ? { backgroundColor: "lightgray" } : {},
              ]}>
              <MediaComponent
                uri={item.uri}
                type={item.type}
                style={
                  item.type === "image"
                    ? styles.draggable_image
                    : styles.flatlist_video
                }
                controls={false}
                play={false}
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 5,
                }}>
                {imageList.indexOf(item) == 0
                  ? "Cover"
                  : `${imageList.indexOf(item)}`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item: { uri: string }) => item.uri}
          horizontal
          onDragEnd={handleDragEnd}
        />
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPressOut={() => setShowModal(false)}>
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}>
              {/* Added cover image and TextInput in the modal */}
              <View style={styles.coverContainer}>
                {/* <Image
                source={{ uri: imageList[0].uri }}
                style={styles.modalCoverImage}
                onError={(error) => console.log(error)}
              /> */}
                <MediaComponent
                  uri={imageList[0].uri}
                  type={imageList[0].type}
                  style={styles.modalCoverImage}
                  controls={false}
                  play={false}
                />
              </View>
              <TextInput
                style={[
                  styles.titleInput,
                  !collectionTitle && { color: "rgba(255,255,255,0.5)" },
                ]} // change text color when no title is set
                placeholder="Title Collection"
                placeholderTextColor="rgba(0,0,0,0.2)" // Changed the placeholder text color
                value={collectionTitle}
                onChangeText={setCollectionTitle}
              />
              <TextInput
                style={styles.editorialInput}
                placeholder="Enter description (up to 500 words)"
                placeholderTextColor="rgba(0,0,0,0.3)"
                multiline={true}
                maxLength={500}
                value={editorialText}
                onChangeText={setEditorialText}
              />
              <Text style={styles.modalSubtitle}>Content: {imageCount}</Text>
              <Text style={styles.modalSubtitle}>
                Created At: {new Date(currentDateTime).toLocaleString()}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.shareButton,
                    !collectionTitle
                      ? { backgroundColor: "rgba(64, 93, 230, 0.5)" }
                      : {},
                  ]}
                  onPress={handleConfirmButtonPressed}
                  disabled={!collectionTitle} // Disable if no title
                >
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist_container: {
    // backgroundColor: "white",
    borderRadius: 10,
    width: 70, //Dimensions.get("window").width / 5,
    height: "auto", //Dimensions.get("window").height / 10,
    padding: 0,
    margin: 5,
    marginBottom: 0,
    overflow: "hidden",
  },
  draggable_image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
  },
  flatlist_image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
    zIndex: -1,
  },

  flatlist_video: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    // resizeMode: "cover",
    // other styles similar to flatlist_image
  },
  cover_image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    aspectRatio: 1,
    resizeMode: "contain",
    alignSelf: "center",
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",

    color: "#000",
    marginBottom: 10,
  },
  editorialInput: {
    // borderWidth: 2,
    // borderColor: "#6200EA",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    maxHeight: 200,
    // backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align at the bottom
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 25,
    borderRadius: 15,
    width: "100%",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    fontSize: 16,
    color: "grey",
    textAlign: "left",
    marginBottom: 5,
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
    elevation: 2,
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
    elevation: 2,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  shareButton: {
    backgroundColor: "#405DE6", // Instagram gradient start color as a solid example
    paddingVertical: 12, // More padding for bigger touch target
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded corners
    borderColor: "#405DE6", // Same as background color
    borderWidth: 1,
    width: "80%",
    marginTop: 10,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16, // Size to fit your needs
    textAlign: "center", // Center the text
    fontWeight: "bold", // Bold text
  },
});

export default AddCollectionView;
