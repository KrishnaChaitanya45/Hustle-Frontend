/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store/store';
import notifee, {EventType} from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('Message handled on click!', remoteMessage);
});
messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the kill state!', remoteMessage);
});

const AppWithProvider = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => AppWithProvider);
