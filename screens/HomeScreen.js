import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { useTheme, useAppContext } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation, route }) {
  // Get theme and app context
  const { theme } = useTheme();
  const { tasks, loading, addTask, updateTask, deleteTask } = useAppContext();
  
  // State definitions
  const [taskText, setTaskText] = useState("");

  // View task details
  const viewTaskDetails = (task) => {
    navigation.navigate("TaskDetails", {
      task,
    });
  };

  // Toggle task completion status
  const toggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { completed: !task.completed });
    }
  };

  // Add new task
  const handleAddTask = () => {
    if (taskText.trim().length === 0) {
      return;
    }

    // Add new task
    addTask({
      text: taskText,
      categoryId: null,
      notes: "",
    });
    
    setTaskText("");
    Keyboard.dismiss();
  };

  // Render task item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => viewTaskDetails(item)}
    >
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={(e) => {
          e.stopPropagation();
          toggleComplete(item.id);
        }}
      >
        <View
          style={[
            styles.checkbox, 
            { borderColor: theme.primary },
            item.completed && { backgroundColor: theme.primary }
          ]}
        />
        <Text
          style={[
            styles.taskText, 
            { color: theme.text },
            item.completed && { textDecorationLine: 'line-through', color: theme.secondaryText }
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.danger }]}
        onPress={(e) => {
          e.stopPropagation();
          deleteTask(item.id);
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    input: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
    },
    emptyText: {
      color: theme.secondaryText,
    }
  };

  // Show loading screen while data is being loaded
  if (loading) {
    return (
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.content}>
        {/* Task input form */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Add a new task..."
            placeholderTextColor={theme.secondaryText}
            value={taskText}
            onChangeText={setTaskText}
          />
          <TouchableOpacity 
            style={[styles.addButton, dynamicStyles.addButton]} 
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
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            style={styles.list}
          />
        ) : (
          <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No tasks added yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// Static styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 80,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  taskTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
