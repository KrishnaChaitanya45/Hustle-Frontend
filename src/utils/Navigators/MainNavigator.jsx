import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from '../../pages/OnBoarding/Onboarding';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import BottomNavigator from '../../components/bottombar/BottomNavigator';
import RegisterTwo from '../../pages/Register/RegisterTwo';

import {TabContextProvider, useTabMenu} from '../../contexts/TabContexts';
import AccountSettings from '../../pages/Settings/AccountSettings';
import UserProfile from '../../pages/User/UserProfile';
import EditProfile from '../../pages/User/EditProfile';
import CreateTask from '../../pages/Tasks/CreateTask';
import AllTasks from '../../pages/Tasks/AllTasks';
import EditTask from '../../pages/Tasks/EditTask';
import IndividualMainTask from '../../pages/Tasks/IndividualMainTask';
import SubTask from '../../pages/Tasks/SubTask';
const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  const Splash = ({navigation}) => {
    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('deardiary');

        if (token) {
          navigation.navigate('homepage');
        } else {
          setTimeout(async () => {
            navigation.navigate('login');
          }, 2000);
        }
      } catch (error) {
        console.log('No key exists in AsyncStorage');
        navigation.navigate('login');
      }
    };

    return (
      <View
        style={{
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}>
        <Text style={{color: 'white', fontSize: 28}}>Dear Diary</Text>
      </View>
    );
  };

  return (
    <TabContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="splash">
          <Stack.Screen name="splash" component={Splash} />
          <Stack.Screen name="onboarding" component={Onboarding} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="user" component={BottomNavigator} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="register-two" component={RegisterTwo} />
          <Stack.Screen name="homepage" component={BottomNavigator} />
          <Stack.Screen name="settings" component={AccountSettings} />
          <Stack.Screen name="edit-profile" component={EditProfile} />
          <Stack.Screen name="create-task" component={CreateTask} />
          <Stack.Screen name="all-tasks" component={AllTasks} />
          <Stack.Screen name="edit-task" component={EditTask} />
          <Stack.Screen name="ind-task" component={IndividualMainTask} />
          <Stack.Screen name="sub-task" component={SubTask} />

          {/* <Stack.Screen name="forgotpassword" component={Forgot} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </TabContextProvider>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
