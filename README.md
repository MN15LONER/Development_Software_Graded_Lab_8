# 📱 ProjectTracker App

A lightweight React Native app that helps users manage projects and tasks with real-time updates using Firebase. Built with Expo, React Navigation, and Context API for global state management.

## 🚀 Features

- **Projects Screen (Bottom Tab)**
  - Fetches and displays a list of projects from Firebase.
  - Each project shows its name and the number of associated tasks.
  - Real-time updates when tasks are added or deleted.

- **Tasks Screen (Stack Navigation)**
  - Navigates to this screen when a project is tapped.
  - Displays all tasks for the selected project.
  - Allows users to add and delete tasks.
  - If no tasks exist, shows: `"No tasks found for this project."`

- **Global State with Context API**
  - Remembers the currently selected project across tabs and navigation.
  - Ensures consistent task display without re-selection.

- **Real-Time Sync**
  - Task changes instantly reflect on the Projects screen.
  - Uses Firebase listeners for live updates.

- **Graceful Error Handling**
  - If a project is deleted from Firebase while viewing its tasks, the app auto-navigates back to the Projects screen without crashing.

## 🧱 Tech Stack

- React Native (Expo)
- Firebase Firestore
- React Navigation (Bottom Tabs + Stack)
- Context API
- Hooks (`useEffect`, `useState`, `useContext`)

## 📦 Installation

```bash
git clone https://github.com/your-username/projecttracker-app.git
cd projecttracker-app
npm install
npx expo install
