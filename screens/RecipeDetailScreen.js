import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Checkbox, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [ingredients, setIngredients] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    extractIngredients();
    checkIfFavorite();
  }, []);

  const extractIngredients = () => {
    const ing = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ing.push({ ingredient: ingredient.trim(), measure });
      }
    }
    setIngredients(ing);
  };

  const checkIfFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      const exists = favorites.find((fav) => fav.idMeal === recipe.idMeal);
      if (exists) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        favorites = favorites.filter((fav) => fav.idMeal !== recipe.idMeal);
        setIsFavorite(false);
        Alert.alert('Removed from Favorites');
      } else {
        favorites.push(recipe);
        setIsFavorite(true);
        Alert.alert('Added to Favorites');
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error(error);
    }
  };

const addToShoppingList = async () => {
  try {
    const storedItems = await AsyncStorage.getItem('shoppingList');
    const shoppingList = storedItems ? JSON.parse(storedItems) : [];
    const newIngredients = ingredients.map((item) => ({
      name: item.ingredient,
      purchased: false,
      quantity: 1,
      image: `https://www.themealdb.com/images/ingredients/${item.ingredient}-Small.png`,
    }));

    const mergedList = [...shoppingList];
    newIngredients.forEach((ingredient) => {
      if (!mergedList.some((item) => item.name === ingredient.name)) {
        mergedList.push(ingredient);
      }
    });

    await AsyncStorage.setItem('shoppingList', JSON.stringify(mergedList));
    Alert.alert('Success', 'Ingredients added to shopping list!');
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to add ingredients to shopping list.');
  }
};

  const handleCheckboxToggle = (index) => {
    setCheckedIngredients((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.favoriteContainer}>
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            color="#ff6347"
            size={28}
            onPress={toggleFavorite}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <MaterialIcons name="category" size={20} color="#555" /> {recipe.strCategory}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="restaurant-menu" size={20} color="#555" /> {recipe.strArea}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Checkbox
                status={checkedIngredients[index] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxToggle(index)}
                color="#ff6347"
              />
              <Text style={styles.ingredientText}>
                {item.ingredient} - {item.measure}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>
        </View>

        <Button
          mode="contained"
          onPress={addToShoppingList}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="cart-plus"
          buttonColor='#ff6347'
        >
          Add Ingredients to Shopping List
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 8,
    color: '#333',
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#ff6347',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    textAlign: 'justify',
  },
  button: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
