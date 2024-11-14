import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons';

export default function LandingPage() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/bg.jpg.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.appName}>FoodiePal</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RecipeSearch')}
          >
            <MaterialIcons name="search" size={48} color="#fff" />
            <Text style={styles.buttonText}>Search Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ShoppingList')}
          >
            <FontAwesome5 name="shopping-basket" size={48} color="#fff" />
            <Text style={styles.buttonText}>Shopping List</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Pantry')}
            >
          <MaterialCommunityIcons name="fridge-variant" size={48} color="#fff" />
          <Text style={styles.buttonText}>My Pantry</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 16,
  },
});
