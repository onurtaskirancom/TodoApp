import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Switch, 
  TouchableOpacity, 
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, useAppContext } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const { theme, darkMode, toggleTheme } = useTheme();
  const { clearAllTasks } = useAppContext();
  const [notifications, setNotifications] = useState(false);
  
  // Clear all tasks
  const handleClearAllTasks = async () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllTasks();
            if (success) {
              Alert.alert('Success', 'All tasks have been cleared!');
            } else {
              Alert.alert('Error', 'Failed to clear tasks!');
            }
          },
        },
      ]
    );
  };
  
  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    section: {
      backgroundColor: theme.card,
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
      marginHorizontal: 15,
      borderColor: theme.border,
      borderWidth: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.text,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.text,
    },
    dangerButton: {
      backgroundColor: '#F44336',
      padding: 15,
      borderRadius: 4,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    aboutItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    aboutLabel: {
      fontSize: 16,
      color: theme.text,
    },
    aboutValue: {
      fontSize: 16,
      color: theme.secondaryText,
    },
    statusText: {
      color: theme.text,
    }
  });
  
  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
        <TouchableOpacity
          style={[dynamicStyles.settingItem, { backgroundColor: theme.card }]}
          onPress={toggleTheme}
        >
          <View style={dynamicStyles.settingContent}>
            <MaterialIcons
              name={darkMode ? 'dark-mode' : 'light-mode'}
              size={24}
              color={theme.text}
            />
            <Text style={[dynamicStyles.settingText, { color: theme.text }]}>
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Notifications</Text>
        <View style={dynamicStyles.settingItem}>
          <Text style={dynamicStyles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Data</Text>
        <TouchableOpacity
          style={[dynamicStyles.settingItem, { backgroundColor: theme.danger }]}
          onPress={handleClearAllTasks}
        >
          <View style={dynamicStyles.settingContent}>
            <MaterialIcons name="delete-forever" size={24} color="white" />
            <Text style={[dynamicStyles.settingText, { color: 'white' }]}>
              Clear All Tasks
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>About</Text>
        <View style={dynamicStyles.aboutItem}>
          <Text style={dynamicStyles.aboutLabel}>Version</Text>
          <Text style={dynamicStyles.aboutValue}>1.0.0</Text>
        </View>
        <View style={dynamicStyles.aboutItem}>
          <Text style={dynamicStyles.aboutLabel}>Developer</Text>
          <Text style={dynamicStyles.aboutValue}>Your Name</Text>
        </View>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Categories</Text>
        <TouchableOpacity
          style={[dynamicStyles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Categories')}
        >
          <View style={dynamicStyles.settingContent}>
            <MaterialIcons name="category" size={24} color={theme.text} />
            <Text style={[dynamicStyles.settingText, { color: theme.text }]}>
              Manage Categories
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Static styles
const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
  },
}); 