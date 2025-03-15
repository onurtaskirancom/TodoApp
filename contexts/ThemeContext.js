import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Default categories
export const defaultCategories = [
  { id: '1', name: 'Personal', color: '#FF5733' },
  { id: '2', name: 'Work', color: '#33FF57' },
  { id: '3', name: 'Shopping', color: '#3357FF' },
  { id: '4', name: 'Health', color: '#FF33F5' },
  { id: '5', name: 'Education', color: '#33FFF5' },
];

// Theme context
const ThemeContext = createContext();

// App context for task management
export const AppContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState(themes.light);
  const [tasksCleared, setTasksCleared] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  // Load saved data
  useEffect(() => {
    loadThemePreference();
    loadTasks();
    loadCategories();
  }, []);

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

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('@categories');
      if (savedCategories !== null) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@todo_items');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setTheme(newDarkMode ? themes.dark : themes.light);
    try {
      await AsyncStorage.setItem('@theme_preference', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const addCategory = async (newCategory) => {
    try {
      const updatedCategories = [...categories, { ...newCategory, id: Date.now().toString() }];
      await AsyncStorage.setItem('@categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };

  const updateCategory = async (categoryId, updatedCategory) => {
    try {
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? { ...category, ...updatedCategory } : category
      );
      await AsyncStorage.setItem('@categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const updatedCategories = categories.filter(category => category.id !== categoryId);
      await AsyncStorage.setItem('@categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);

      // Update tasks that had this category
      const updatedTasks = tasks.map(task => ({
        ...task,
        categoryId: task.categoryId === categoryId ? null : task.categoryId
      }));
      await AsyncStorage.setItem('@todo_items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  const addTask = async (newTask) => {
    try {
      const taskWithDefaults = {
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
        ...newTask
      };
      const updatedTasks = [...tasks, taskWithDefaults];
      await AsyncStorage.setItem('@todo_items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      );
      await AsyncStorage.setItem('@todo_items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem('@todo_items', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem('@todo_items');
      setTasks([]);
      setTasksCleared(true);
      setTimeout(() => setTasksCleared(false), 100);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      <AppContext.Provider value={{
        tasks,
        categories,
        loading,
        tasksCleared,
        addTask,
        updateTask,
        deleteTask,
        clearAllTasks,
        addCategory,
        updateCategory,
        deleteCategory,
        loadTasks
      }}>
        {children}
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
};

// Custom hooks
export const useTheme = () => useContext(ThemeContext);
export const useAppContext = () => useContext(AppContext); 