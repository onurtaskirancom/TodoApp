import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors
const themes = {
  light: {
    background: '#f5f5f5',
    card: 'white',
    text: '#333333',
    secondaryText: '#757575',
    primary: '#2196F3',
    border: '#dddddd',
    danger: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    secondaryText: '#aaaaaa',
    primary: '#2196F3',
    border: '#333333',
    danger: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
  },
};

// Create theme context
const ThemeContext = createContext();

// Context for application-wide event management
export const AppContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState(themes.light);
  const [tasksCleared, setTasksCleared] = useState(false);

  // Load theme preference from AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem('@theme_preference');
        if (storedPreference !== null) {
          const isDarkMode = JSON.parse(storedPreference);
          setDarkMode(isDarkMode);
          setTheme(isDarkMode ? themes.dark : themes.light);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Theme toggle function
  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setTheme(newDarkMode ? themes.dark : themes.light);
    
    // Save theme preference to AsyncStorage
    try {
      await AsyncStorage.setItem('@theme_preference', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Function that triggers the clear all tasks event
  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem('@todo_items');
      setTasksCleared(true);
      // Reset the event (to be ready for the next clearing)
      setTimeout(() => setTasksCleared(false), 100);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      <AppContext.Provider value={{ tasksCleared, clearAllTasks }}>
        {children}
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
};

// Theme hook
export const useTheme = () => useContext(ThemeContext);

// App context hook
export const useAppContext = () => useContext(AppContext); 