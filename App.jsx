import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainNavigator from './src/utils/Navigators/MainNavigator';
import {Provider} from 'react-redux';
import store from './src/store/store';
// import MainNavigator from './src/utils/Navigators/MainNavigator';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
