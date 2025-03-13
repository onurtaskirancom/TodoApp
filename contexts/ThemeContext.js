import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tema renkleri
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

// Tema bağlamı oluşturma
const ThemeContext = createContext();

// Tema sağlayıcı bileşeni
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState(themes.light);

  // Tema tercihini AsyncStorage'dan yükleme
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

  // Tema değiştirme fonksiyonu
  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setTheme(newDarkMode ? themes.dark : themes.light);
    
    // Tema tercihini AsyncStorage'a kaydetme
    try {
      await AsyncStorage.setItem('@theme_preference', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tema hook'u
export const useTheme = () => useContext(ThemeContext); 