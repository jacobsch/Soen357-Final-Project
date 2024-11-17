import PocketBase from 'pocketbase';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const pb = new PocketBase('http://127.0.0.1:8090');

export default function ShoppingListScreen({ navigation }) {
  const [goingList, setGoingList] = useState([]);
  const [boughtList, setBoughtList] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('shoppingList');
      const shoppingList = storedItems ? JSON.parse(storedItems) : [];

      const going = shoppingList.filter((item) => !item.purchased);
      const bought = shoppingList.filter((item) => item.purchased);

      setGoingList(going);
      setBoughtList(bought);
    } catch (error) {
      console.error(error);
    }
  };

  const saveShoppingList = async (list) => {
    try {
      await AsyncStorage.setItem('shoppingList', JSON.stringify(list));
      fetchShoppingList();
    } catch (error) {
      console.error(error);
    }
  };

  const addNewItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    const newItem = {
      name: newItemName.trim(),
      purchased: false,
      quantity: 1,
      image: `https://www.themealdb.com/images/ingredients/${newItemName.trim()}-Small.png`,
    };

    const updatedList = [...goingList, newItem];
    setNewItemName('');
    saveShoppingList([...updatedList, ...boughtList]);
    const record = await pb.collection('shopping_list').create(newItem);
  };

  const handleCheckboxToggle = async (index, isGoing) => {
    const listToUpdate = isGoing ? [...goingList] : [...boughtList];
    const item = listToUpdate[index];
    item.purchased = !item.purchased;

    if (item.purchased) {
      addToPantry(item);
      setGoingList(goingList.filter((_, i) => i !== index));
      setBoughtList([...boughtList, item]);
    } else {
      setBoughtList(boughtList.filter((_, i) => i !== index));
      setGoingList([...goingList, item]);
    }

    const updatedList = [...goingList, ...boughtList];
    saveShoppingList(updatedList);
  };

  const addToPantry = async (item) => {
    try {
      const storedPantry = await AsyncStorage.getItem('pantry');
      const pantry = storedPantry ? JSON.parse(storedPantry) : [];

      if (!pantry.some((pantryItem) => pantryItem.name === item.name)) {
        pantry.push(item);
        await AsyncStorage.setItem('pantry', JSON.stringify(pantry));
        Alert.alert('Success', `${item.name} added to pantry!`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add item to pantry.');
    }
  };

  const renderItem = ({ item, index }, isGoing) => (
    <View style={styles.itemContainer}>
      <Checkbox
        status={item.purchased ? 'checked' : 'unchecked'}
        onPress={() => handleCheckboxToggle(index, isGoing)}
        color="#fff"
        backgroundColor="#ff6347"
        uncheckedColor="#fff"
      />
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text
        style={[
          styles.itemText,
          item.purchased && { textDecorationLine: 'line-through', color: '#888' },
        ]}
      >
        {item.name}
      </Text>
      <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
      <IconButton
        icon="delete"
        color="#ff6347"
        size={24}
        onPress={() => handleDelete(index, isGoing)}
      />
    </View>
  );

  const handleDelete = (index, isGoing) => {
    const listToUpdate = isGoing ? [...goingList] : [...boughtList];
    listToUpdate.splice(index, 1);

    const updatedList = isGoing ? [...listToUpdate, ...boughtList] : [...goingList, ...listToUpdate];
    saveShoppingList(updatedList);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Shopping List</Text>
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Items to Buy</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={goingList}
          keyExtractor={(item) => item.name}
          renderItem={(item) => renderItem(item, true)}
          ListEmptyComponent={<Text style={styles.emptyText}>No items to buy.</Text>}
        />
      </View>
      <Text style={styles.sectionTitle}>Purchased Items</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={boughtList}
          keyExtractor={(item) => item.name}
          renderItem={(item) => renderItem(item, false)}
          ListEmptyComponent={<Text style={styles.emptyText}>No items bought yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    height: 50,
    width: 60,
    backgroundColor: '#ff6347',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff6347',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  listContainer: {
    maxHeight: 350,
    marginHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  quantityText: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft:10,
  },
});
