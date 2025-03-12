import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Platform, 
  StatusBar,
  Keyboard,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_items';

export default function HomeScreen({ navigation }) {
  // State definitions
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Loaded data:', storedTasks);
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
        console.log('Data loaded!');
      }
    } catch (error) {
      console.error('Loading error:', error);
      Alert.alert('Error', 'An error occurred while loading tasks.');
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (tasksToSave) => {
    try {
      const jsonValue = JSON.stringify(tasksToSave);
      console.log('Saving:', jsonValue);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Saved!');
    } catch (error) {
      console.error('Saving error:', error);
      Alert.alert('Error', 'An error occurred while saving tasks.');
    }
  };

  // Load tasks when app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks when they change
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  // Add new task
  const handleAddTask = () => {
    if (task.trim().length === 0) {
      return;
    }

    // Add new task
    setTasks([...tasks, {text: task, completed: false}]);
    setTask('');
    Keyboard.dismiss();
  };

  // Toggle task completion status
  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }
  
  // Delete task
  const handleDeleteTask = (index) => {
    const filteredTasks = tasks.filter((_, i) => i !== index);
    setTasks(filteredTasks);
  }

  // View task details
  const viewTaskDetails = (item, index) => {
    navigation.navigate('TaskDetails', { task: item, index, onUpdate: updateTask });
  };

  // Update task from details screen
  const updateTask = (index, updatedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
  };

  // Render task item
  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.taskContainer}
      onPress={() => viewTaskDetails(item, index)}
    >
      <TouchableOpacity 
        style={styles.taskTextContainer} 
        onPress={(e) => {
          e.stopPropagation();
          toggleComplete(index);
        }}
      >
        <View style={[
          styles.checkbox, 
          item.completed && styles.checkboxChecked
        ]} />
        <Text 
          style={[
            styles.taskText, 
            item.completed && styles.taskTextCompleted
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={(e) => {
          e.stopPropagation();
          handleDeleteTask(index);
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Show loading screen while data is being loaded
  if (loading) {
    return (
      <View style={styles.content}>
        <Text style={styles.emptyText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Task input form */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddTask}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {/* Task list */}
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>No tasks added yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#2196F3',
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  taskText: {
    fontSize: 16,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
    fontSize: 16,
  }
}); 