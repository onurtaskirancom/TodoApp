import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { useTheme, useAppContext } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function CategoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { categories, addCategory, deleteCategory, updateCategory } = useAppContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF5733');

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5',
    '#FFB533', '#FF3333', '#33FFB5', '#B533FF', '#33B5FF'
  ];

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Error', 'Category name cannot be empty!');
      return;
    }

    const success = await addCategory({
      name: newCategoryName.trim(),
      color: selectedColor
    });

    if (success) {
      setNewCategoryName('');
      Alert.alert('Success', 'Category added successfully!');
    } else {
      Alert.alert('Error', 'Failed to add category!');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteCategory(categoryId);
            if (success) {
              Alert.alert('Success', 'Category deleted successfully!');
            } else {
              Alert.alert('Error', 'Failed to delete category!');
            }
          }
        }
      ]
    );
  };

  const renderColorItem = ({ item: color }) => (
    <TouchableOpacity
      style={[
        styles.colorItem,
        { backgroundColor: color },
        selectedColor === color && styles.selectedColor
      ]}
      onPress={() => setSelectedColor(color)}
    />
  );

  const renderCategoryItem = ({ item }) => (
    <View style={[styles.categoryItem, { borderColor: theme.border }]}>
      <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
      <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCategory(item.id)}
      >
        <MaterialIcons name="delete" size={24} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          placeholder="New category name..."
          placeholderTextColor={theme.secondaryText}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <FlatList
          data={colors}
          renderItem={renderColorItem}
          keyExtractor={(item) => item}
          horizontal
          style={styles.colorList}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddCategory}
        >
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  colorList: {
    marginBottom: 16,
  },
  colorItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
}); 