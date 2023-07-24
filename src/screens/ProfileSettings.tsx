import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Switch,
  Button,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserData, ProfileUser } from "../model/types";
import { PROFILE_SETTINGS_SECTIONS } from "../constants/ProfileSettings_Section";
import { saveUserData, fetchUserData } from "../redux_toolkit/slices/user_data";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Section, SectionItem } from "../model/types";
import { useAppSelector } from "../redux_toolkit";
import { useNavigation } from "@react-navigation/native";

interface ProfileSettingsProps extends ProfileUser {}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({}) => {
  const dispatch = useDispatch();

  const { firstName, lastName, username, bio, avatar } = useAppSelector(
    (state) => state.userData.userData
  );

  const [formData, setFormData] = useState<UserData>({
    firstName: firstName,
    lastName: lastName,
    username: username,
    bio: bio,
    avatar: avatar,
  });

  const navigation = useNavigation();

  const navigateToScreen = (screen: string) => {
    navigation.navigate(screen);
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // useEffect(() => {
  //   console.log("OUTPUT: " + firstName + lastName + username + bio);
  //   // @ts-ignore
  //   dispatch(fetchUserData());
  // }, [dispatch]);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchUserData());

    const unsubscribe = navigation.addListener("focus", () => {
      // Fetch updated user data when the screen comes into focus
      // @ts-ignore
      dispatch(fetchUserData());
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, [navigation, dispatch]);

  const handleSave = () => {
    //@ts-ignore
    dispatch(saveUserData(formData));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f6f6f6" }}>
      {/* <Button
        title="Save"
        onPress={() => {
          handleSave();
          //@ts-ignore
          dispatch(fetchUserData());
        }}
      /> */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile Settings</Text>
        </View>
        <Text style={styles.subtitle}>
          Set Profile View settings & user configuration
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.profile_header}>
          <TouchableOpacity style={styles.circle}>
            {avatar?.uri ? (
              <Image source={{ uri: avatar.uri }} style={styles.profileImage} />
            ) : (
              <View style={styles.emptyCircle} />
            )}
          </TouchableOpacity>
          <View style={{ marginLeft: 30, marginTop: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.profile_header_text]}>{firstName}</Text>
              <Text style={[styles.profile_header_text, { marginLeft: 10 }]}>
                {lastName}
              </Text>
            </View>
            <Text style={[styles.profile_header_text, { marginTop: 10 }]}>
              {username}
            </Text>
            <Text style={[styles.profile_header_text, { marginTop: 10 }]}>
              {bio}
            </Text>
            {/* <View style={styles.profile_info}>
                <Text style={styles.label}>{firstName}</Text>
                <TextInput
                  value={formData.firstName}
                  onChangeText={(value) => handleChange("firstName", value)}
                  style={styles.textInput}
                />
              </View>
              <View>
                <View style={styles.profile_info}>
                  <Text style={styles.label}>{lastName}</Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(value) => handleChange("lastName", value)}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.profile_info}>
                  <Text style={styles.label}>{username}</Text>
                  <TextInput
                    value={formData.username}
                    onChangeText={(value) => handleChange("username", value)}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.profile_info}>
                  <Text style={styles.label}>{bio}</Text>
                  <TextInput
                    value={formData.bio}
                    onChangeText={(value) => handleChange("bio", value)}
                    style={styles.textInput}
                    multiline
                  />
                </View>
              </View> */}
          </View>
        </View>
        {PROFILE_SETTINGS_SECTIONS.map(({ header, items }: Section) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>
            <View style={styles.sectionBody}>
              {items.map(
                (
                  { id, label, icon, type, screen, value }: SectionItem,
                  index
                ) => {
                  return (
                    <View
                      key={id}
                      style={[
                        styles.rowWrapper,
                        index === 0 && { borderTopWidth: 0 },
                      ]}>
                      <TouchableOpacity
                        onPress={() => navigateToScreen(screen)}>
                        <View style={styles.row}>
                          {icon}
                          <Text style={styles.rowLabel}>{label}</Text>
                          <View style={styles.rowSpacer} />
                          {type === "select" && (
                            <Text style={styles.rowValue}>{formData[id]}</Text>
                          )}
                          {type === "toggle" && <Switch value={value} />}
                          {(type === "select" || type === "link") && (
                            <MaterialIcons
                              name="arrow-forward-ios"
                              size={18}
                              color="black"
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <Button title="Save" onPress={handleSave} />
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  section: {
    paddingTop: 12,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  header: {
    // flexDirection: "row",
    // alignItems: "center",
    paddingLeft: 16,
    paddingRight: 24,
    marginTop: 25,
  },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e6e6e6",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  profile_header: {
    marginBottom: 20,
    marginLeft: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profile_header_text: {
    fontSize: 14,
    fontWeight: "300",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 35,
    marginLeft: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profile_info: {
    marginBottom: 20,
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a7a7a7",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  rowValue: {
    fontSize: 17,
    color: "#616161",
    marginRight: 4,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
