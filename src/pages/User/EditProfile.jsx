import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import userIcon from '../../../assets/images/avatar1.png';
import EditIcon from '../../../assets/icons/edit.svg';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import {useRoute} from '@react-navigation/native';
import personRunning from '../../../assets/videos/man-running.json';
import Lottie from 'lottie-react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {TextInput} from 'react-native-paper';
import colors from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const EditProfile = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [imageurl, setImageUrl] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [Loading, setLoading] = useState(false);
  const [TasksError, setTasksError] = useState(false);
  const [bio, setBio] = useState('');
  const [TargetTasks, setTargetTasks] = useState(0);
  const [InterestValue, setInterestValue] = useState(null);
  const [Interests, setInterests] = useState([]);
  const [bioError, setBioError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const route = useRoute();
  React.useEffect(() => {
    if (route.params) {
      setLoading(true);
      if (route.params) {
        setUserData(route.params);
        setLoading(false);
      }
      setImageUrl(route.params.profilePhoto);
      setUsername(route.params.username);
      setName(route.params.name);
      setInterests(route.params.interests[0].split(','));
      setBio(route.params.bio);
      setTargetTasks(route.params.target.targetTasks);
    }
  }, [route.params]);
  const pickImage = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    console.log(file.uri);
    if (file) {
      setImage(file);
      setImageUrl(file.uri);
    }
  };
  function addInterests(e) {
    e.preventDefault();
    if (InterestValue.length < 3) return;

    let interests = [...Interests, InterestValue];
    setInterests(interests);
    setInterestValue('');
  }
  const showToastRegisterTwo = (text1, text2, type) => {
    Toast.show({
      text1: text1,
      text2: text2,
      type: type,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 25,
    });
  };
  const submitHandler = async () => {
    let validbio, validusername, validtasks, validname;
    if (bio.length == '') {
      showToastRegisterTwo(
        'Please Enter Your Bio 🐱',
        'Please try again',
        'error',
      );
      setBioError(true);
      setUsernameError(false);
      setTasksError(false);
      setNameError(false);
      return;
    } else {
      if (bio.trim().length < 3) {
        showToastRegisterTwo('Bio Too Short..!😏', 'Please try again', 'error');
        setBioError(true);
        setUsernameError(false);
        setTasksError(false);
        setNameError(false);
        return;
      }
      validbio = bio;
    }
    if (username.length == '') {
      showToastRegisterTwo(
        'Please Enter a Username 🐒',
        'Please try again',
        'error',
      );
      setUsernameError(true);
      setBioError(false);
      setNameError(false);
      setTasksError(false);
      return;
    } else {
      if (username.trim().length < 5) {
        showToastRegisterTwo(
          'Please Enter a Valid Username 😒',
          'Please try again',
          'error',
        );
        setUsernameError(true);
        setBioError(false);
        setTasksError(false);
        setNameError(false);
        return;
      }
      validusername = username;
    }
    if (TargetTasks <= 0) {
      showToastRegisterTwo(
        'Negative Tasks?😏😁',
        'Tasks cannot be less than or equal to zero',
        'error',
      );
      setTasksError(true);
      setUsernameError(false);
      setBioError(false);
      setNameError(false);
      return;
    } else {
      if (TargetTasks > 50) {
        showToastRegisterTwo(
          'Are you sure about the target tasks?😏😁',
          "I don't think you can do that much.😅",
          'error',
        );
        setTasksError(true);
        setUsernameError(false);
        setBioError(false);
        setNameError(false);
        return;
      }
      validtasks = TargetTasks;
    }

    if (name.length == '') {
      showToast('Please Enter Your Name 😁', 'Please try again', 'error');
      setNameError(true);
      setTasksError(false);
      setUsernameError(false);
      setBioError(false);

      return;
    } else {
      if (name.trim().length < 3) {
        showToast('Please Enter a Valid Name 😏', 'Please try again', 'error');
        setNameError(true);

        setTasksError(false);
        setUsernameError(false);
        setBioError(false);
        return;
      }
      validname = name;
    }
    if (validtasks && validbio && validusername && validname) {
      console.log(validtasks);
      console.log(Interests);
      setLoading(true);
      const body = new FormData();
      body.append('username', validusername);
      body.append('name', validname);
      body.append('bio', validbio);
      body.append('targetTasks', validtasks);
      body.append('interests', Interests);
      if (image) {
        const profileImage = {
          uri: image.uri,
          type: image.type,
          name: `${name}'s-profile-picture.jpg}`,
        };
        body.append('image', profileImage);
      }
      console.log(body);
      //name , email, password, bio, interests, username, profilePhoto, targetTasks
      try {
        console.log('request sent');

        const response = await axios.patch(
          `https://deardiary-backend.onrender.com/api/v1/auth/update/${userData._id}`,

          body,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log(response.data);
        const user = response.data.user;
        console.log('response user' + user);
        try {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.log('user updating failed');
        }
        const storeduser = await AsyncStorage.getItem('user');
        console.log('stored user' + storeduser);
        if (user) {
          setLoading(false);
          showToastRegisterTwo(
            `Server Error 😢`,
            'Sorry for the inconvenience. We are working on it 🙍‍♂️',
            'success',
          );
          showToastRegisterTwo(
            `Profile Updated 😄`,
            'You cab go back to your profile now, or try opening the app again.',
            'success',
          );
        }
      } catch (error) {
        showToastRegisterTwo(
          `Server Error 😢`,
          'Sorry for the inconvenience. We are working on it 🙍‍♂️',
          'error',
        );
        // props.navigation.navigate('register');
        console.log(error.response.data, error);
      }
    }
  };
  return (
    <>
      {!Loading ? (
        <View style={styles.container}>
          <View style={{zIndex: 3}}>
            <Toast autoHide={false} />
          </View>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('user', {
                  name: 'user',
                })
              }>
              <LeftArrow width={30} height={30} />
            </TouchableOpacity>
            <Text style={styles.infoText}>Edit Profile</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.detailsContainer}
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              <TouchableOpacity>
                <Image
                  source={{uri: imageurl} || userIcon}
                  style={styles.userIcon}
                />
              </TouchableOpacity>
              <EditIcon width={30} height={30} style={styles.editIcon} />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                label="Username"
                style={
                  usernameError
                    ? {
                        borderBottomColor: 'red',
                        borderBottomWidth: 1,
                        backgroundColor: 'white',
                      }
                    : {
                        backgroundColor: 'transparent',
                        padding: 5,
                        shadowColor: colors.themeBlue,
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 0.2,
                        shadowRadius: 12,
                        fontFamily: 'Poppins-Medium',
                        elevation: 2,
                      }
                }
                underlineStyle="flat"
                textColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                placeholderTextColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                outlineColor={usernameError ? 'red' : colors.themeBlue}
                activeUnderlineColor={
                  usernameError ? 'red' : colors.themePurple
                }
                value={username}
                onChangeText={val => setUsername(val)}
                placeholder="Make sure it is unique 😉"
              />
              <TextInput
                label="Name"
                style={
                  nameError
                    ? {
                        borderBottomColor: 'red',
                        borderBottomWidth: 1,
                        backgroundColor: 'white',
                      }
                    : {
                        backgroundColor: 'transparent',
                        padding: 5,
                        shadowColor: colors.themeBlue,
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 0.2,
                        shadowRadius: 12,

                        elevation: 2,
                      }
                }
                underlineStyle="flat"
                textColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                placeholderTextColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                outlineColor={nameError ? 'red' : colors.themeBlue}
                activeUnderlineColor={nameError ? 'red' : colors.themePurple}
                value={name}
                onChangeText={val => setName(val)}
                placeholder="You want us to call you as..! 😄"
              />
              <TextInput
                label="Bio"
                style={
                  bioError
                    ? {
                        borderBottomColor: 'red',
                        borderBottomWidth: 1,
                        backgroundColor: 'white',
                      }
                    : {
                        backgroundColor: 'transparent',
                        padding: 5,
                        shadowColor: colors.themeBlue,
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 0.2,
                        shadowRadius: 12,

                        elevation: 2,
                      }
                }
                underlineStyle="flat"
                textColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                placeholderTextColor={
                  usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                }
                outlineColor={bioError ? 'red' : colors.themeBlue}
                activeUnderlineColor={bioError ? 'red' : colors.themePurple}
                value={bio}
                onChangeText={val => setBio(val)}
                multiline={true}
                numberOfLines={4}
                placeholder="You want us to call you as..! 😄"
              />
            </View>
            <View style={styles.interestsContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  padding: 3,
                  shadowColor: colors.themeBlue,
                  shadowOffset: {width: 0, height: 5},
                  shadowOpacity: 0.2,
                  shadowRadius: 12,

                  elevation: 2,
                }}>
                <TextInput
                  label="Interests"
                  maxLength={15}
                  placeholder="Add your interests...!"
                  style={{
                    backgroundColor: 'transparent',
                    width: '65%',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    borderBottomColor: colors.themeBlue,
                    borderBottomWidth: 1,
                  }}
                  underlineStyle="flat"
                  textColor={
                    usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                  }
                  placeholderTextColor={
                    usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
                  }
                  outlineColor={colors.themeBlue}
                  activeUnderlineColor={colors.themePurple}
                  value={InterestValue}
                  onChangeText={val => setInterestValue(val)}
                />
                <TouchableOpacity
                  onPress={addInterests}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',

                    marginTop: 15,
                    backgroundColor: '#E8C547',
                    padding: 5,
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      textAlign: 'center',
                      color: '#30323D',
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                }}>
                {Interests.length !== 0 ? (
                  Interests.map((item, index) => {
                    return (
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: '#E8C547',
                          padding: 10,
                          borderRadius: 12,
                          margin: 5,
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                        key={index}>
                        <Text
                          key={index}
                          style={{
                            color: 'black',
                            textAlign: 'center',
                            flex: 2,
                            fontFamily: 'Poppins-Bold',
                            fontSize: 16,
                          }}>
                          {item}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            console.log(index);
                            let interests = [...Interests];
                            interests.splice(index, 1);
                            setInterests(interests);
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#D8D8D8',
                              backgroundColor: '#FF5E5B',
                              flex: 1,
                              paddingTop: 5,
                              paddingBottom: 5,
                              paddingLeft: 10,
                              paddingRight: 10,
                              borderRadius: 100,
                            }}
                            key={index}>
                            X
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <View
                    style={{
                      borderColor: '#ED6A5A',
                      borderWidth: 1,
                      width: '100%',
                      padding: 5,
                      borderRadius: 12,
                    }}>
                    <Text
                      style={{
                        color: colors.themeRed,
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 800,
                      }}>
                      No Interests Added
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TextInput
              label="Target Tasks"
              value={TargetTasks}
              style={
                TasksError
                  ? {
                      width: '100%',
                      borderBottomColor: 'red',
                      borderBottomWidth: 1,
                      backgroundColor: 'white',
                    }
                  : {
                      backgroundColor: 'transparent',
                      padding: 5,
                      width: '100%',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      shadowColor: colors.themeBlue,
                      shadowOffset: {width: 0, height: 5},
                      shadowOpacity: 0.2,
                      shadowRadius: 12,

                      elevation: 2,
                    }
              }
              keyboardType="numeric"
              underlineStyle="flat"
              textColor={
                usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
              }
              placeholderTextColor={
                usernameError ? colors.themeYellow : 'rgba(255,255,255,0.7)'
              }
              outlineColor={TasksError ? 'red' : colors.themeBlue}
              activeUnderlineColor={TasksError ? 'red' : colors.themePurple}
              onChangeText={val => setTargetTasks(val)}
              placeholder="Set Yourself a target ..! 🚀"
            />
            <View style={styles.submitContainer}>
              <TouchableOpacity
                onPress={submitHandler}
                style={styles.submitButton}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'center',
                    color: colors.themeBlack,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.ErrorPage}>
          <Lottie source={personRunning} autoPlay loop />
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.ErrorText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default EditProfile;

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
  imageContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    left: '60%',
  },
  detailsContainer: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 20,
  },
  userIcon: {
    width: 150,
    height: 150,
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  inputContainer: {
    width: '100%',
    gap: 10,
    flexDirection: 'column',
  },
  submitContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  submitButton: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.themeBlue,
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
});
