import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TabContainer from '../../components/Tab/TabContainer';
import userIcon from '../../../assets/images/avatar1.png';
import colors, {
  themeBlack,
  themeBlue,
  themeGrey,
  themeLightBlue,
  themeLightWhite,
  themeLightYellow,
  themePurple,
  themeYellow,
} from '../../utils/colors';
import Dashboard from '../../../assets/icons/dashboard.svg';
import RightIcon from '../../../assets/icons/right-arrow.svg';
import EditIcon from '../../../assets/icons/edit.svg';
import axios from 'axios';
import FireIcon from '../../../assets/icons/fire.svg';
import personRunning from '../../../assets/videos/man-running.json';
import Lottie from 'lottie-react-native';
import AccountSettings from '../../../assets/icons/settings.svg';
import PremiumIcon from '../../../assets/icons/star.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useRoute} from '@react-navigation/native';
const {width, height} = Dimensions.get('screen');
const UserProfile = ({navigation}) => {
  //DashBoard Option
  const [userData, setUserData] = useState(null);
  const showToast = (text1, text2, type) => {
    Toast.show({
      text1: text1,
      text2: text2,
      type: type,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };
  const router = useRoute();
  const tasks = async user => {
    try {
      const id = user._id;
      const response = await axios.get(
        `https://deardiary-backend.onrender.com/api/v1/tasks/${id}/main-tasks`,
      );
    } catch (error) {}
  };
  const user = async () => {
    if (router.params) {
      console.log(router.params);
      return setUserData(router.params);
    } else {
      if (!userData) {
        try {
          const cookie = await AsyncStorage.getItem('deardiary');
          try {
            console.log('FETCH REQUEST SENT');
            const response = await fetch(
              `https://deardiary-backend.onrender.com/api/v1/auth/login/user-details/${cookie}`,
              {
                method: 'GET',

                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            const data = await response.json();
            console.log('=== DATA FETCHED ===', data);
            setUserData(data.user);
          } catch (error) {
            showToast(
              'Server Side Error 😢..!',
              "We'll fix this error thanks for being patient 😄..!",
              'error',
            );
            console.log(error);
          }
        } catch (error) {
          showToast(
            'User Not Found..! 🚫',
            'Try Logging out and login again..!',
            'error',
          );
        }
      }
    }
  };

  useEffect(() => {
    setUserData(null);
    user();
  }, []);
  console.log(userData);
  return (
    <TabContainer>
      <View style={{zIndex: 10}}>
        <Toast />
      </View>
      {userData ? (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.headingInfo}>My Profile</Text>
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: userData.profilePhoto}}
                style={styles.userIcon}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>
                {userData.name[0].toUpperCase() + userData.name.slice(1) ||
                  'User Name'}
              </Text>
              {/* //TODO add slice(0,60) to the bio */}
              <Text style={styles.bio}>
                {userData.bio.slice(0, 60) ||
                  "You haven't added a bio yet, click on the edit icon to add one..!😉"}
              </Text>
              <View style={styles.firePoints}>
                <View style={styles.fireIcon}>
                  <FireIcon width={30} height={30} />
                </View>
                <Text style={styles.firePointsText}>{userData.points}</Text>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => navigation.navigate('edit-profile', userData)}>
                <EditIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.interests_Section_Container}>
            <Text style={styles.interestsHeading}>Interests 🚀</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.interestsContainer}
              showsHorizontalScrollIndicator={true}
              bounces={false}>
              {userData.interests[0].split(',').map((interest, index) => {
                return (
                  <View style={styles.indInterest} key={index}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.settingsContainer}>
            <View style={styles.indOption}>
              <Dashboard width={40} height={40} style={styles.indIcon} />
              <Text style={styles.indOption_text}>Dashboard ✨</Text>
              <RightIcon width={30} height={30} style={styles.rightIcon} />
            </View>
            <TouchableOpacity
              style={[styles.indOption]}
              onPress={() => {
                navigation.navigate('settings');
                console.log('clicked');
              }}>
              <AccountSettings
                width={40}
                height={40}
                style={styles.settingsIcon}
              />
              <Text style={styles.indOption_text}> Preferences </Text>
              <RightIcon width={30} height={30} style={styles.rightIcon} />
            </TouchableOpacity>
            <View style={styles.indOption}>
              <PremiumIcon width={35} height={35} style={styles.indIcon} />
              <Text style={styles.indOption_text}>Get Premium 🔥</Text>
              <RightIcon width={30} height={30} style={styles.rightIcon} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.ErrorPage}>
          <Lottie source={personRunning} autoPlay loop />
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.ErrorText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </TabContainer>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.themeBlack,
    padding: 20,
    gap: 20,
  },
  infoContainer: {
    width: '100%',
    height: 40,
    alignItems: 'flex-start',
  },
  headingInfo: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
  profileContainer: {
    width: '100%',
    height: '20%',
    overflow:"hidden",
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: themeBlack,
    shadowColor: '#595BD4',
    gap: 20,
    position: 'relative',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    gap: 20,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
  },
  userIcon: {
    width: width * 0.325,
    height: height * 0.15,
    borderRadius: 100,
  },
  editIcon: {
    position: 'absolute',
    top: '-5%',
    left: '70%',
  },
  detailsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2.5,
    // paddingRight: 10,
    marginLeft: '15%',
    fontFamily: 'Poppins-Medium',
  },
  name: {
    fontSize: 18,
    color: '#595BD4',
    fontFamily: 'Poppins-Bold',
  },
  imageContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bio: {
    fontSize: 14,
    color: colors.themePurple,
    opacity: 0.8,
    width: 200,
    fontFamily: 'Montserrat-Medium',
  },
  interests_Section_Container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  interestsHeading: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
  interestsContainer: {
    flexGrow: 1,
    minWidth: '120%',
    margin: 15,
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  indInterest: {
    backgroundColor: '#E8C547',
    padding: 10,
    borderRadius: 20,
  },
  interestText: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    color: 'black',
  },
  settingsContainer: {
    width: '100%',
  },
  indOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 20,
    shadowColor: colors.themeBlue,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    margin: 10,
  },
  indOption_text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.themePurple,
  },
  ErrorPage: {
    flex: 1,
    backgroundColor: colors.themeBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ErrorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: colors.themeYellow,
  },
  ErrorTextMessage: {
    fontFamily: 'Lato-Medium',
    maxWidth: '70%',
    textAlign: 'center',
    fontSize: 16,
    color: colors.themePurple,
  },
  firePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 5,
    backgroundColor: themeGrey,
    width: '50%',
    marginTop: '5%',
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  fireIcon: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: themeLightYellow,
    height: '100%',
    width: '50%',
    alignItems: 'center',
  },
  firePointsText: {
    width: '50%',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
});
