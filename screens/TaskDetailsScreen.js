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
import { useTheme, useAppContext } from '../contexts/ThemeContext';
import { Picker } from '@react-native-picker/picker';

export default function TaskDetailsScreen({ route, navigation }) {
  const { task } = route.params;
  const { theme } = useTheme();
  const { updateTask, categories } = useAppContext();
  
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  const [notes, setNotes] = useState(task.notes || '');
  const [categoryId, setCategoryId] = useState(task.categoryId || null);
  
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
      notes,
      categoryId
    };
    
    updateTask(task.id, updatedTask);
    navigation.goBack();
  };
  
  // Discard changes and go back
  const cancelChanges = () => {
    navigation.goBack();
  };

  // Get category color
  const getCategoryColor = () => {
    if (!categoryId) return '#CCCCCC';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#CCCCCC';
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
    pickerContainer: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      marginBottom: 10,
    },
    picker: {
      color: theme.text,
    },
    categoryIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 10,
      backgroundColor: getCategoryColor(),
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
        <Text style={dynamicStyles.label}>Category</Text>
        <View style={dynamicStyles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => setCategoryId(itemValue)}
            style={dynamicStyles.picker}
            dropdownIconColor={theme.text}
          >
            <Picker.Item label="No Category" value={null} />
            {categories.map(category => (
              <Picker.Item 
                key={category.id} 
                label={category.name} 
                value={category.id} 
                color={category.color}
              />
            ))}
          </Picker>
        </View>
        {categoryId && (
          <View style={dynamicStyles.categoryRow}>
            <View style={dynamicStyles.categoryIndicator} />
            <Text style={{ color: theme.text }}>
              {categories.find(c => c.id === categoryId)?.name || 'Unknown Category'}
            </Text>
          </View>
        )}
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