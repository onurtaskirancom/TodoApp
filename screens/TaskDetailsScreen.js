import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function TaskDetailsScreen({ route, navigation }) {
  const { task, index, onUpdate } = route.params;
  const { theme } = useTheme();
  
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  const [notes, setNotes] = useState(task.notes || '');
  
  // Save changes and go back
  const saveChanges = () => {
    if (text.trim().length === 0) {
      Alert.alert('Error', 'Task text cannot be empty');
      return;
    }
    
    const updatedTask = {
      ...task,
      text,
      completed,
      notes
    };
    
    onUpdate(index, updatedTask);
    navigation.goBack();
  };
  
  // Discard changes and go back
  const cancelChanges = () => {
    navigation.goBack();
  };
  
  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      color: theme.text,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      padding: 10,
    },
    statusText: {
      fontSize: 16,
      color: theme.text,
    },
  });
  
  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={styles.formGroup}>
        <Text style={dynamicStyles.label}>Task</Text>
        <TextInput
          style={dynamicStyles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter task"
          placeholderTextColor={theme.secondaryText}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={dynamicStyles.label}>Status</Text>
        <View style={dynamicStyles.statusContainer}>
          <Text style={dynamicStyles.statusText}>
            {completed ? 'Completed' : 'Active'}
          </Text>
          <Switch
            value={completed}
            onValueChange={setCompleted}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={completed ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={dynamicStyles.label}>Notes</Text>
        <TextInput
          style={[dynamicStyles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
          placeholderTextColor={theme.secondaryText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={cancelChanges}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={saveChanges}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Static styles
const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  notesInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 