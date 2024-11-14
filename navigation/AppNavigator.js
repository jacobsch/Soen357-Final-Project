import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingPage from '../screens/LandingPage';
import RecipeSearchScreen from '../screens/RecipeSearchScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import PantryScreen from '../screens/PantryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="RecipeSearch" component={RecipeSearchScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="ShoppingList" component={ShoppingListScreen}/>
        <Stack.Screen
  name="Pantry"
  component={PantryScreen}
  options={{
    headerShown: false, // We're using a custom back button
  }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
