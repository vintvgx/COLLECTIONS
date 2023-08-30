#Multi-Image Sharing Mobile App with React Native, Redux Toolkit & Firebase

##Welcome to the repository of our Mobile Zine app, where users can share and display multiple images as collections and tell their stories via an editorial section. This app is built using React Native with TypeScript and integrated with Redux Toolkit for state management and Firebase for data storage and authentication.

Features

Multiple Image Collections: Users can create collections of images that portray a theme, mood, or story.
Editorial Section: Each collection can be complemented with an editorial section where users can provide explanations, descriptions, or any narrative related to their images.
CRUD Operations: The app supports creating, reading, updating, and deleting collections, providing users full control over their content.
Firebase Integration: Firebase is used to store image collections and their associated editorials. It also facilitates user authentication.
State Management with Redux Toolkit: The app's state is managed using Redux Toolkit, ensuring smooth state transitions and easy debugging.
Setting Up

Prerequisites
Node.js and npm/yarn
React Native CLI
A Firebase account and a new project
Steps
Clone the Repository:
bash
Copy code
git clone [repository_url]
cd [repository_name]
Install Dependencies:
bash
Copy code
yarn install
# or 
npm install
Set up Firebase:
Go to your Firebase project and set up Firebase Authentication and Firestore.
Obtain your Firebase project configuration.
Create a .env file in the project root and add the Firebase configuration:
makefile
Copy code
FIREBASE_API_KEY=YOUR_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
FIREBASE_APP_ID=YOUR_APP_ID
Run the App:
bash
Copy code
react-native run-android # For Android
# or 
react-native run-ios # For iOS
Project Structure

src/: Contains the main codebase
components/: Reusable UI components
screens/: Different screens of the app (e.g., Home, Collection Detail, Editorial, etc.)
redux/: Redux state management (actions, reducers, store)
services/: Firebase services for CRUD operations
types/: TypeScript interfaces and types
utils/: Helper functions and constants
assets/: Static files like images, fonts, etc.
