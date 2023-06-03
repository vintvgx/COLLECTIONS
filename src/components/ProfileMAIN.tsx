import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface ProfileMainProps {
  profilePicture: string;
  collections: number;
  fans: number;
}

const ProfileMain: React.FC<ProfileMainProps> = ({
  profilePicture,
  collections,
  fans,
}) => {
  const navigation = useNavigation();

  const goToProfileSettings = () => {
    navigation.navigate("ProfileSettings");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToProfileSettings} style={styles.circle}>
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      </TouchableOpacity>
      <View style={styles.row}>
        <View style={styles.numberContainer}>
          <Text style={styles.labelText}>Collections</Text>
          <Text style={styles.numberText}>{collections}</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.labelText}>Fans</Text>
          <Text style={styles.numberText}>{fans}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 270,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  numberContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  numberText: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
  },
  labelText: {
    fontSize: 20,
    color: "black",
  },
});

export default ProfileMain;
