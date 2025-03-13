import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Import theme provider
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack with task details
function HomeStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tasks" 
        component={HomeScreen} 
        options={{ 
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen} 
        options={{ 
          title: 'Task Details',
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Main app component with tab navigation
function MainApp() {
  const { theme, darkMode } = useTheme();
  
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={darkMode ? "light-content" : "dark-content"} 
        backgroundColor={darkMode ? "#000000" : "#ffffff"} 
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.secondaryText,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Wrap the app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
