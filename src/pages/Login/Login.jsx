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
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import LoginSvg from '../../../assets/images/Login.svg';
import axios from 'axios';
import Lottie from 'lottie-react-native';
import {TextInput, Image, Animated, Keyboard} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import personRunning from '../../../assets/videos/man-running.json';
import colors from '../../utils/colors';
const Login = ({navigation}) => {
  const {width, height} = Dimensions.get('screen');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
  let validpassword, validemail;
  const submitHandler = async () => {
    if (password.length == '') {
      showToast('Please Enter Your Password 🐱', 'Please try again', 'error');
      setPasswordError(true);
      setEmailError(false);
      return;
    } else {
      validpassword = password;
    }
    if (email.length == '') {
      showToast('Please Enter Your Email 🐱', 'Please try again', 'error');
      setEmailError(true);
      setPasswordError(false);
      return;
    } else {
      validemail = email;
    }
    if (validemail && validpassword) {
      setLoading(true);
      const body = {
        email: validemail,
        password: validpassword,
      };
      console.log(body);
      try {
        console.log('requested');
        const {data} = await axios.post(
          'https://deardiary-backend.onrender.com/api/v1/auth/login',
          body,
        );
        setUser(data.user);
        setToken(data.token);
        await AsyncStorage.setItem('deardiary', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        const token = await AsyncStorage.getItem('deardiary');
        console.log(token);
        if (data.user !== null) {
          navigation.navigate('homepage');
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        flexGrow: 1,
      }}>
      {loading ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: 10,
            width: '100%',
            backgroundColor: colors.themeBlack,
          }}>
          <Lottie source={personRunning} autoPlay loop />
        </View>
      ) : (
        <View>
          <View style={{zIndex: 10}}>
            <Toast />
          </View>
          <LoginSvg width={width} height={height / 2} style={{zIndex: 5}} />

          <View
            style={{
              transform: [
                {
                  translateY: -height / 8,
                },
              ],
              width: width,
              zIndex: 2,

              borderRadius: 50,
              // alignItems: 'center',
              padding: 30,
              backgroundColor: '#FF7F50',
            }}>
            <KeyboardAvoidingView behavior="padding">
              <ScrollView>
                <Text
                  style={{
                    color: 'black',
                    marginTop: 50,
                    marginBottom: 20,
                    fontSize: 35,
                    fontFamily:"Poppins-Bold"
                  }}>
                  Login 🚀
                </Text>
                <View>
                  <TextInput
                    label="Email"
                    style={
                      emailError
                        ? {
                            borderBottomColor: 'red',
                            borderBottomWidth: 1,
                            backgroundColor: 'transparent',
                          }
                        : {backgroundColor: 'transparent'}
                    }
                    underlineStyle="flat"
                    outlineColor={emailError ? 'red' : 'black'}
                    onChangeText={text => setEmail(text)}
                    activeUnderlineColor={emailError ? 'red' : 'black'}
                    value={email ? email : ""}
                  />
                  <TextInput
                    label="Password"
                    style={
                      passwordError
                        ? {
                            borderBottomColor: 'red',
                            borderBottomWidth: 1,
                            backgroundColor: 'transparent',
                          }
                        : {backgroundColor: 'transparent'}
                    }
                    underlineStyle="flat"
                    outlineColor={passwordError ? 'red' : 'black'}
                    onChangeText={text => setPassword(text)}
                    activeUnderlineColor={passwordError ? 'red' : 'black'}
                    value={password}
                    secureTextEntry
                    // right={<TextInput.Icon icon="eye" />}
                  />
                  <View
                    style={{
                      alignItems: 'center',
                      margin: 25,
                      justifyContent: 'center',
                      height: 50,
                      backgroundColor: 'black',
                      borderRadius: 12,
                    }}>
                    <TouchableOpacity
                      style={{backgroundColor: 'black'}}
                      onPress={submitHandler}>
                      <Text
                        style={{fontSize: 18, color: '#fff', fontFamily:"Poppins-Medium"}}>
                        Submit 👍
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            <View
              style={{
                display: 'flex',
                marginTop: 10,
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 600, fontSize: 16}}>
                Don't have an Account?
              </Text>
              <TouchableOpacity
              style={{backgroundColor: 'black', padding: 7.5, borderRadius: 10}}
                onPress={() => navigation.navigate('register')}
              >
                <Text style={{ fontSize:14, fontFamily: 'Poppins-Medium'}}> Register </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({});
