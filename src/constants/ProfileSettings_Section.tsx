import React, { ReactNode } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Section } from "../utils/types";

export const PROFILE_SETTINGS_SECTIONS: Section[] = [
  {
    header: "Account Information",
    items: [
      {
        id: "personal_details",
        icon: <Ionicons name="person-circle-outline" size={24} color="black" />,
        label: "Personal Details",
        type: "select",
        screen: "PersonalDetails",
      },
      {
        id: "display_name",
        icon: (
          <MaterialIcons
            name="drive-file-rename-outline"
            size={24}
            color="black"
          />
        ),
        label: "Display Name",
        type: "toggle",
        value: true,
      },
      {
        id: "collection_views",
        icon: <MaterialCommunityIcons name="counter" size={24} color="black" />,
        label: "Collection Views",
        type: "toggle",
        value: false,
      },
      {
        id: "change_password",
        icon: (
          <MaterialCommunityIcons name="onepassword" size={24} color="black" />
        ),
        label: "Change Password",
        type: "select",
      },
      {
        id: "information_permissions",
        icon: <Ionicons name="settings" size={24} color="black" />,
        label: "Your Information & Permissions",
        type: "select",
      },
    ],
  },
  {
    header: "Interactive Components",
    items: [
      {
        id: "dark_mode",
        icon: (
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color="black"
          />
        ),
        label: "Dark Mode",
        type: "toggle",
        value: false,
      },
      {
        id: "notifications",
        icon: <Ionicons name="notifications-circle" size={24} color="black" />,
        label: "Notifications",
        type: "toggle",
        value: true,
      },
      {
        id: "enhance photos",
        icon: (
          <MaterialIcons name="add-photo-alternate" size={24} color="black" />
        ),
        label: "Enhance Photos",
        type: "toggle",
        value: false,
      },
    ],
  },
];

// const SECTIONS = [t,
//     {
//       header: "Account Information",
//       items: [
//         {
//           id: "personal_details",
//           icon: <Ionicons name="person-circle-outline" size={24} color="black" />,
//           label: "Personal Details",
//           type: "select",
//         },
//         {
//           id: "display_name",
//           icon: (
//             <MaterialIcons
//               name="drive-file-rename-outline"
//               size={24}
//               color="black"
//             />
//           ),
//           label: "Display Name",
//           type: "toggle",
//         },
//         {
//           id: "collection_views",
//           icon: <MaterialCommunityIcons name="counter" size={24} color="black" />,
//           label: "Collection Views",
//           type: "toggle",
//         },
//         {
//           id: "change_password",
//           icon: (
//             <MaterialCommunityIcons name="onepassword" size={24} color="black" />
//           ),
//           label: "Change Password",
//           type: "select",
//         },
//         {
//           id: "information_permissions",
//           icon: <Ionicons name="settings" size={24} color="black" />,
//           label: "Your Information & Permissions",
//           type: "select",
//         },
//       ],
//     },
//     {
//       header: "Interactive Components",
//       items: [
//         {
//           id: "dark_mode",
//           icon: (
//             <MaterialCommunityIcons
//               name="theme-light-dark"
//               size={24}
//               color="black"
//             />
//           ),
//           label: "Dark Mode",
//           type: "toggle",
//         },
//         {
//           id: "notifications",
//           icon: <Ionicons name="notifications-circle" size={24} color="black" />,
//           label: "Notifications",
//           type: "toggle",
//         },
//         {
//           id: "enhance photos",
//           icon: (
//             <MaterialIcons name="add-photo-alternate" size={24} color="black" />
//           ),
//           label: "Enhance Photos",
//           type: "toggle",
//         },
//       ],
//     },
//   ];
