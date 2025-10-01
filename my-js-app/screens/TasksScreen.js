import React, { useState, useEffect } from 'react';
import {View, Text, FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useProject } from '../context/ProjectContext';

export default function TasksScreen({ navigation }) {
  const { selectedProject, setSelectedProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const projectDocRef = doc(db, 'projects', selectedProject.id);
    
    const unsubscribeProject = onSnapshot(
      projectDocRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          Alert.alert(
            'Project Deleted',
            'This project has been deleted.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setSelectedProject(null);
                  navigation.navigate('ProjectsTab');
                },
              },
            ],
            { cancelable: false }
          );
        }
      },
      (error) => {
        console.error('Error monitoring project:', error);
      }
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('projectId', '==', selectedProject.id)
    );

    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      async (snapshot) => {
        const tasksData = [];
        
        snapshot.forEach((doc) => {
          tasksData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        setTasks(tasksData);
        setLoading(false);

        const projectRef = doc(db, 'projects', selectedProject.id);
        await updateDoc(projectRef, {
          taskCount: tasksData.length,
        });
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeProject();
      unsubscribeTasks();
    };
  }, [selectedProject]);

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    if (!selectedProject) {
      Alert.alert('Error', 'No project selected');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        name: newTaskName.trim(),
        projectId: selectedProject.id,
        createdAt: new Date().toISOString(),
      });
      setNewTaskName('');
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tasks', taskId));
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (!selectedProject) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noProjectText}>No project selected</Text>
        <Text style={styles.noProjectSubtext}>
          Please select a project from the Projects tab
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.projectTitle}>{selectedProject.name}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={newTaskName}
          onChangeText={setNewTaskName}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks found for this project.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noProjectText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noProjectSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
