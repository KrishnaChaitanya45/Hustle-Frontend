import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Lottie from 'lottie-react-native';
import personRunning from '../../../assets/videos/man-running.json';

/* 
Fields 
- Name
- Username
- bio
- email
- interests
- create password
- confirm password
- target tasks / day
- profilePhoto
Pages - 
1 ] 
 - name
 - email
 - password
 - confirm password
 2] 
 - username
 - bio
 - profile photo
 - interests
 - target tasks
*/

import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import Avatar from '../../../assets/images/avatar1.png';
import {Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {TextInput, Animated, Keyboard} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import colors from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RegisterTwo = props => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [bioError, setBioError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [TasksError, setTasksError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [TargetTasks, setTargetTasks] = useState(0);
  const [InterestValue, setInterestValue] = useState(null);
  const [Interests, setInterests] = useState([]);
  const route = useRoute();
  const {name, email, password} = route.params;

  let screenWidth;
  let screenHeight;
  const {width, height} = Dimensions.get('screen');
  screenWidth = width;
  screenHeight = height;
  useEffect(() => {}, [Interests]);
  const pickImage = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    if (file) {
      setImage(file);
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
  const registerHandler = async () => {
    let validbio, validusername, validtasks;
    if (bio.length == '') {
      showToastRegisterTwo(
        'Please Enter Your Bio 🐱',
        'Please try again',
        'error',
      );
      setBioError(true);
      setUsernameError(false);
      setTasksError(false);
      return;
    } else {
      if (bio.trim().length < 3) {
        showToastRegisterTwo('Bio Too Short..!😏', 'Please try again', 'error');
        setBioError(true);
        setUsernameError(false);
        setTasksError(false);
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
        return;
      }
      validtasks = TargetTasks;
    }
    if (validtasks && validbio && validusername) {
      console.log(validtasks);
      console.log(Interests);
      setLoading(true);
      const body = new FormData();
      body.append('name', name);
      body.append('email', email);
      body.append('password', password);
      body.append('username', validusername);
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

        const response = await axios.post(
          'https://deardiary-backend.onrender.com/api/v1/auth/register',

          body,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log(response.data);
        const token = response.data.token;
        const user = response.data.user;
        await AsyncStorage.setItem('deardiary', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        if (user) {
          setLoading(false);
          props.navigation.navigate('homepage');
        }
      } catch (error) {
        showToastRegisterTwo(
          `Server Error 😢`,
          'Sorry for the inconvenience. We are working on it 🙍‍♂️',
          'error',
        );
        console.log("Couldn't register");
        // props.navigation.navigate('register');
        console.log(error.response.data, error);
      }
    }
  };
  useEffect(() => {
    showToastRegisterTwo(
      `Welcome ${name} 😉`,
      'Click the avatar to change your profile photo.',
      'info',
    );
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      {/* showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled" scrollEnabled={true} */}
      {Loading ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: 10,
            width: '100%',
            backgroundColor: colors.themeBlack,
          }}>
          <Toast autoHide={false} />
          <Lottie source={personRunning} autoPlay loop />
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
            flex: 1,
          }}>
          <View style={{zIndex: 10}}>
            <Toast autoHide={false} />
          </View>
          <View
            style={{
              padding: 5,
              alignItems: 'center',
              top: 20,
            }}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  image
                    ? {uri: image.uri}
                    : require('../../../assets/images/avatar1.png')
                }
                width={210}
                height={210}
                resizeMode="cover"
                style={{
                  width: 210,
                  height: 210,
                  bottom: 20,
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              transform: [
                {
                  translateY: -40,
                },
              ],
              zIndex: -1,
              width: screenWidth,
              borderRadius: 50,
              // alignItems: 'center',
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 50,
              backgroundColor: '#4cc9f0',
            }}>
            <KeyboardAvoidingView behavior="padding">
              <ScrollView>
                <Text
                  style={{
                    color: '#f5f5f5',
                    marginTop: 50,
                    marginBottom: 20,
                    fontSize: 28,
                    fontWeight: 800,
                    padding: 10,
                  }}>
                  Hey {name}..! 🙌
                </Text>
                <View>
                  <TextInput
                    label="Username"
                    style={
                      usernameError
                        ? {
                            borderBottomColor: 'red',
                            borderBottomWidth: 1,
                            backgroundColor: 'transparent',
                          }
                        : {backgroundColor: 'transparent'}
                    }
                    underlineStyle="flat"
                    outlineColor={usernameError ? 'red' : 'black'}
                    activeUnderlineColor={usernameError ? 'red' : 'black'}
                    value={username}
                    onChangeText={val => setUsername(val)}
                    placeholder="Make sure it is unique 😉"
                  />

                  <TextInput
                    label="Bio"
                    multiline={true}
                    numberOfLines={4}
                    value={bio}
                    onChangeText={val => setBio(val)}
                    placeholder="Describe yourself in a few words...!"
                    style={
                      bioError
                        ? {
                            borderBottomColor: 'red',
                            borderBottomWidth: 1,
                            backgroundColor: 'transparent',
                          }
                        : {backgroundColor: 'transparent'}
                    }
                    underlineStyle="flat"
                    outlineColor={bioError ? 'red' : 'black'}
                    activeUnderlineColor={bioError ? 'red' : 'black'}
                  />
                  <TextInput
                    label="Target Tasks"
                    value={TargetTasks}
                    onChangeText={val => setTargetTasks(val)}
                    placeholder="Number of tasks per day...!"
                    keyboardType="numeric"
                    style={
                      TasksError
                        ? {
                            borderBottomColor: 'red',
                            borderBottomWidth: 1,
                            backgroundColor: 'transparent',
                          }
                        : {backgroundColor: 'transparent'}
                    }
                    underlineStyle="flat"
                    outlineColor={TasksError ? 'red' : 'black'}
                    activeUnderlineColor={TasksError ? 'red' : 'black'}
                  />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 15,
                    }}>
                    <TextInput
                      label="Interests"
                      maxLength={15}
                      placeholder="Add your interests...!"
                      style={{
                        backgroundColor: 'transparent',
                        width: '65%',
                      }}
                      underlineStyle="flat"
                      outlineColor="black"
                      activeUnderlineColor="black"
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
                      marginTop: 30,
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
                                fontSize: 16,
                                fontWeight: 800,
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
                            color: 'black',
                            textAlign: 'center',
                            fontSize: 16,
                            fontWeight: 800,
                          }}>
                          No Interests Added
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 25,
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        marginRight: 5,
                        justifyContent: 'center',
                        height: 50,
                        shadowColor: 'white',
                        shadowRadius: 50,
                        shadowOpacity: 0.75,
                        shadowOffset: {
                          width: 0,
                          height: 15,
                        },

                        flex: 1,
                        backgroundColor: 'transparent',
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: 'black',
                      }}>
                      <TouchableOpacity
                        onPress={() => props.navigation.navigate('register')}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: 'black',
                          }}>
                          Back
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        flex: 1,
                        backgroundColor: 'black',
                        borderRadius: 12,
                      }}>
                      <TouchableOpacity
                        style={{backgroundColor: 'black'}}
                        onPress={registerHandler}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#fff',
                          }}>
                          Register
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RegisterTwo;

const styles = StyleSheet.create({});
