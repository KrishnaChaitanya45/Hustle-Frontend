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
import EditProfile from '../../pages/User/EditProfile';
import CreateTask from '../../pages/Tasks/CreateTask';
import AllTasks from '../../pages/Tasks/AllTasks';
import EditTask from '../../pages/Tasks/EditTask';
import IndividualMainTask from '../../pages/Tasks/IndividualMainTask';
import SubTask from '../../pages/Tasks/SubTask';
import PlanYourDay from '../../pages/PlanYourDay/PlanYourDay';
import Habits from '../../pages/Habits/Habits';
import Dashboard from '../../pages/Dashboard/Dashboard';
import ChatPage from '../../pages/Diary/ChatPage';
import ChatEdit from '../../pages/Diary/ChatEdit';
import SearchUser from '../../pages/Diary/SearchUser';
import MessageWithAttachment from '../../pages/Diary/MessageWithAttachment';
import {useDispatch, useSelector} from 'react-redux';
import {setDeviceToken} from '../../features/Socket/SocketSlice';
const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  const Splash = ({navigation}) => {
    useEffect(() => {
      checkAuth();
    }, []);
    const token = useSelector(state => state.socket.deviceToken);
    console.log('=== TOKEN FROM MAIN NAVIGATOR ===', token);
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('deardiary');

        if (token) {
          setTimeout(async () => {
            navigation.navigate('homepage');
          }, 5000);
        } else {
          setTimeout(async () => {
            navigation.navigate('login');
          }, 5000);
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
        <Text style={{color: 'white', fontSize: 28}}>Hustle 🔥</Text>
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
          <Stack.Screen name="plan-your-day" component={PlanYourDay} />
          <Stack.Screen name="habits" component={Habits} />
          <Stack.Screen name="dashboard" component={Dashboard} />
          <Stack.Screen name="ChatScreen" component={ChatPage} />
          <Stack.Screen name="group-chat-edit" component={ChatEdit} />
          <Stack.Screen name="SearchUser" component={SearchUser} />
          <Stack.Screen
            name="message-with-attachment"
            component={MessageWithAttachment}
          />

          {/* <Stack.Screen name="forgotpassword" component={Forgot} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </TabContextProvider>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
