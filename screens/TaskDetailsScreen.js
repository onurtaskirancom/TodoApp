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

export default function TaskDetailsScreen({ route, navigation }) {
  const { task, index, onUpdate } = route.params;
  
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
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Task</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter task"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {completed ? 'Completed' : 'Active'}
          </Text>
          <Switch
            value={completed}
            onValueChange={setCompleted}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={completed ? '#2196F3' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
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
          style={[styles.button, styles.saveButton]} 
          onPress={saveChanges}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
  },
  statusText: {
    fontSize: 16,
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
  saveButton: {
    backgroundColor: '#2196F3',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 