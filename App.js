import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {primary: '#1f145c', white: '#fff', black: '#000', red: 'red'};

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState();

  useEffect(() => {
    saveToDoTouserDevice(todos);
  }, [todos]);

  useEffect(() => {
    getToDoDevice();
  }, []);

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 15,
              fontWeight: 'bold',
              textDecorationLine: todo.completed ? 'line-through' : 'none',
            }}>
            {todo.title}
          </Text>
        </View>
        {!todo.completed && (
          <TouchableOpacity
            onPress={() => markToDoCompleted(todo?.id)}
            style={[styles.actionIcon]}>
            <Icon name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => deleteToDo(todo?.id)}
          style={[styles.actionIcon, {backgroundColor: COLORS.red}]}>
          <Icon name="done" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const addToDo = () => {
    if (textInput === '') {
      Alert.alert('Erro', 'Please enter a your ToDo');
    } else {
      const newTodo = {
        id: Math.random(),
        title: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    }
  };

  const markToDoCompleted = id => {
    const newTodoList = todos.map(item => {
      if (item.id == id) {
        return {...item, completed: true};
      }
      return item;
    });
    console.log(newTodoList);
    setTodos(newTodoList);
  };

  const deleteToDo = id => {
    const newTodoList = todos.filter(item => item.id !== id);
    setTodos(newTodoList);
  };

  const clearToDos = () => {
    Alert.alert('Confirm', 'Clear all your todo?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const saveToDoTouserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todo', stringifyTodos);
      console.log('save');
    } catch (error) {
      console.log(error);
    }
  };

  const getToDoDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todo');
      if (todos != null) {
        console.log('get');
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: COLORS.primary}}>
          TODO APP
        </Text>
        <TouchableOpacity onPress={clearToDos}>
          <Icon name="delete" size={25} color={COLORS.red} />
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            onChangeText={text => setTextInput(text)}
            placeholder="Add Todo"
          />
        </View>
        <TouchableOpacity onPress={addToDo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.black} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    backgroundColor: COLORS.black,
    color: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
