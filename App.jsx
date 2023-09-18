import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MainNavigator from './src/utils/Navigators/MainNavigator';
import {Provider, useDispatch, useSelector} from 'react-redux';

import {
  getToken,
  notificationListener,
  requestUserPermission,
} from './src/utils/messages/Notifications';
import store from './src/store/store';
import {setDeviceToken} from './src/features/Socket/SocketSlice';
import {PermissionsAndroid} from 'react-native';

// import MainNavigator from './src/utils/Navigators/MainNavigator';
const Stack = createNativeStackNavigator();
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Platform.OS === 'android')
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(() => console.log('Permission Granted'))
        .catch(() => console.log('Permission Denied'));
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // e.g. "Settings"
        }
      });

    return unsubscribe;
  }, []);
  const fetchToken = async () => {
    const token = await getToken();
    dispatch(setDeviceToken(token));
  };

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    fetchToken();
  }, []);
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
