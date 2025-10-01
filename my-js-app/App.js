import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { ProjectProvider } from './context/ProjectContext';

export default function App() {
  return (
    <ProjectProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </ProjectProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
