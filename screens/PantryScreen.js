// PantryScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

export default function PantryScreen({ navigation }) {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  useEffect(() => {
    fetchPantryItems();
    registerForPushNotificationsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const fetchPantryItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('pantryItems');
      const items = storedItems ? JSON.parse(storedItems) : [];
      setPantryItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  const savePantryItems = async (items) => {
    try {
      await AsyncStorage.setItem('pantryItems', JSON.stringify(items));
      setPantryItems(items);
    } catch (error) {
      console.error(error);
    }
  };

const addItem = async () => {
    if (newItem.trim() === '') {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }
  
    const ingredientName = newItem.trim();
    const imageUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredientName)}-small.png`;
  
    const updatedItems = [
      ...pantryItems,
      {
        name: ingredientName,
        quantity: quantity.trim() || '1',
        expirationDate: null,
        notificationId: null,
        imageUrl: imageUrl,
      },
    ];
  
    await savePantryItems(updatedItems);
    setNewItem('');
    setQuantity('');
  };

  const deleteItem = async (index) => {
    const updatedItems = [...pantryItems];
    const item = updatedItems.splice(index, 1)[0];

    if (item.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    }

    savePantryItems(updatedItems);
  };

  const showDatePicker = (index) => {
    setSelectedItemIndex(index);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setItemExpirationDate(selectedItemIndex, date);
  };

  const setItemExpirationDate = async (index, date) => {
    const updatedItems = [...pantryItems];
    const item = updatedItems[index];

    if (item.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    }

    if (date <= new Date()) {
      Alert.alert('Invalid Date', 'Please select a future date.');
      return;
    }

    // Schedule notification
    const triggerDate = new Date(date);
    triggerDate.setHours(triggerDate.getHours() - 24);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Item Expiring Soon',
        body: `${item.name} will expire on ${moment(date).format('MMM DD, YYYY')}.`,
      },
      trigger: triggerDate,
    });

    // Update item with expiration date and notification ID
    item.expirationDate = date.toISOString();
    item.notificationId = notificationId;

    updatedItems[index] = item;
    await savePantryItems(updatedItems);
  };

  // Request notification permissions
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive alerts.');
    }
  }

  // Render each item in the pantry
  const renderItem = ({ item, index }) => {
    const isExpiringSoon =
      item.expirationDate &&
      moment(item.expirationDate).diff(moment(), 'days') <= 3;

    return (
      <View
        style={[
          styles.itemContainer,
          isExpiringSoon && { backgroundColor: '#ffe6e6' },
        ]}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image-not-supported" size={40} color="#ccc" />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
          {item.expirationDate && (
            <Text style={styles.expirationText}>
              Expires on {moment(item.expirationDate).format('MMM DD, YYYY')}
            </Text>
          )}
        </View>
        <IconButton
          icon="calendar"
          color="#ff6347"
          size={24}
          onPress={() => showDatePicker(index)}
        />
        <IconButton
          icon="delete"
          color="#ff6347"
          size={24}
          onPress={() => deleteItem(index)}
        />
      </View>
    );
  };

  // Calculate status bar height for back button positioning
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>My Pantry</Text>
      </View>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item name..."
          value={newItem}
          onChangeText={setNewItem}
        />
        <TextInput
          style={styles.quantityInput}
          placeholder="Qty"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={pantryItems.sort((a, b) => {
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return new Date(a.expirationDate) - new Date(b.expirationDate);
        })}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your pantry is empty.</Text>
        }
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  input: {
    flex: 2,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#fff',
  },
  quantityInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
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
  list: {
    paddingTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    color: '#555',
  },
  expirationText: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#888',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    marginLeft: 10,
  },
  homeButton: {
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 5,
  },
});
