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

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack with task details
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tasks" 
        component={HomeScreen} 
        options={{ 
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
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
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Main app component with tab navigation
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
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
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
