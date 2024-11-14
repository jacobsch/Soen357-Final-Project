import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {Ionicons } from '@expo/vector-icons';

export default function RecipeSearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
        <Text style={styles.recipeCategory}>{item.strCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="home" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header}>Recipes</Text>
      </View>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchRecipes}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchRecipes}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff6347" style={styles.loader} />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderRecipe}
            contentContainerStyle={styles.recipeList}
            ListEmptyComponent={
              <Text style={styles.noResults}>No recipes found. Try another search.</Text>
            }
          />
        )}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347',
    textAlign: 'center',
    marginBottom: 16,
    marginTop:40,
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal:10
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    height: 50,
    width: 80,
    backgroundColor: '#ff6347',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipeList: {
    paddingTop: 8,
  },
  recipeItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#888',
  },
  loader: {
    marginTop: 32,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Optional for better visibility
    padding: 8,
    borderRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  homeButton: {
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    marginLeft: 10,
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
});
