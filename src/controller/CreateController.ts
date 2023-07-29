import * as ImagePicker from "expo-image-picker";

class CreateController {
  static async ADD_COLLECTION() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      setImages(result.assets);
      // setImages([...images, { uri: result.uri }]);
    }

    console.log(images);
  }
}
