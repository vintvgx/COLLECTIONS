import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/themeContext";
import { EventRegister } from "react-native-event-listeners";

interface ProfileDropdownMenuProps {
  onNavigateToProfileSettings: () => void;
  onSignOut: () => void;
  onToggle: (isVisible: boolean) => void;
  onReportBug: () => void;
}

const DropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  onSignOut,
  onNavigateToProfileSettings,
  onToggle,
  onReportBug,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { darkMode } = useTheme();
  const theme = {
    backgroundColor: darkMode ? "#000" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    onToggle(!dropdownVisible); // Call the new handler
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.iconContainer}>
        <MaterialIcons
          name="more-vert"
          size={24}
          color={darkMode ? "white" : "black"}
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={onReportBug} style={styles.dropdownItem}>
            <MaterialIcons
              name="bug-report"
              size={20}
              color="gray"
              style={styles.dropdownItemIcon}
            />
            <Text style={styles.dropdownText}>Report Bug</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNavigateToProfileSettings}
            style={styles.dropdownItem}>
            <MaterialIcons
              name="settings"
              size={20}
              color="gray"
              style={styles.dropdownItemIcon}
            />
            <Text style={styles.dropdownText}>Profile Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSignOut} style={styles.dropdownItem}>
            <MaterialIcons
              name="exit-to-app"
              size={20}
              color="gray"
              style={styles.dropdownItemIcon}
            />
            <Text style={[styles.dropdownText, { color: "red" }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  iconContainer: {
    zIndex: 11,
    alignSelf: "flex-end",
  },
  dropdownContainer: {
    // position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "column",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemIcon: {
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DropdownMenu;
