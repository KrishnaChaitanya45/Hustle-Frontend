import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../utils/colors';
import Logout from '../../../assets/icons/logout.svg';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AccountSettings = ({navigation}) => {
  // features to be added
  // Change Theme and font size and type
  // Logout and delete account
  //  Privacy features, who can view your profile and posts
  // About Developer
  // Notification Settings
  // Something about the premium version
  const logoutHandler = async () => {
    // logout and delete account
    try {
      await AsyncStorage.removeItem('deardiary');
      navigation.navigate('login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('user', {
              name: 'user',
            })
          }>
          <LeftArrow width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.infoText}>Preferences</Text>
      </View>
      <TouchableOpacity style={styles.logoutContainer} onPress={logoutHandler}>
        <Logout width={40} height={40} />
        <Text style={styles.logOutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    backgroundColor: colors.themeBlack,
  },
  infoText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: colors.themePurple,
  },
  infoContainer: {
    width: '70%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoutContainer: {
    width: '100%',
    backgroundColor: colors.themeRed,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  logOutText: {
    fontSize: 20,
    marginLeft: '27%',
    fontFamily: 'Poppins-Medium',
    color: colors.themeWhite,
  },
});
