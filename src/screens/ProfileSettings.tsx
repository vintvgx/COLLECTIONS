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
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";

import { UserData, ProfileUser } from "../model/types";
import { PROFILE_SETTINGS_SECTIONS } from "../constants/ProfileSettings_Section";
import {
  saveUserData,
  fetchUserData,
  setDarkMode,
} from "../redux_toolkit/slices/user_data";

import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Section, SectionItem } from "../model/types";
import { useAppSelector } from "../redux_toolkit";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/themeContext";

const ProfileSettings: React.FC = ({}) => {
  const dispatch = useDispatch();

  const { darkMode, toggleDarkMode } = useTheme();
  const theme = {
    backgroundColor: darkMode ? "#000" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  const { firstName, lastName, username, bio, avatar, settings } =
    useAppSelector((state) => state.userData.userData);

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
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={darkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.color }]}>
            Profile Settings
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Set Profile View settings & user configuration
        </Text>
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* USER DATA */}
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
              <Text
                style={[styles.profile_header_text, { color: theme.color }]}>
                {firstName}
              </Text>
              <Text
                style={[
                  styles.profile_header_text,
                  { color: theme.color, marginLeft: 10 },
                ]}>
                {lastName}
              </Text>
            </View>
            <Text
              style={[
                styles.profile_header_text,
                { color: theme.color, marginTop: 10 },
              ]}>
              {username}
            </Text>
            <Text
              style={[
                styles.profile_header_text,
                { color: theme.color, marginTop: 10 },
              ]}>
              {bio}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Settings</Text>
          </View>
          <View
            style={[
              styles.rowWrapper,
              { backgroundColor: darkMode ? "#D3D3D3" : "white" },
            ]}>
            <TouchableOpacity
              onPress={() => navigateToScreen("PersonalDetails")}>
              <View style={styles.row}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={{ marginRight: 2 }}>Personal Details</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={18}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.row}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={24}
                  color="black"
                />
                <Text style={{ marginRight: 2 }}>Light/Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={() => {
                  toggleDarkMode();
                  dispatch(setDarkMode);
                }}
              />
            </View>
          </View>
        </View>

        {/* {PROFILE_SETTINGS_SECTIONS.map(({ header, items }: Section) => (
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
        ))} */}
      </ScrollView>
      {/* <Button title="Save" onPress={handleSave} /> */}
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
    justifyContent: "space-between",
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
