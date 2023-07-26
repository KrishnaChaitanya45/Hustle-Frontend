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
/* 
Fields 
- Name *
- Username *
- bio * 
- email 
- interests * 
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
 - profile photo
 - interests
 - target tasks
*/

import React, {useRef, useState} from 'react';
import RegisterSVG from '../../../assets/images/SignUp.svg';
import Toast from 'react-native-toast-message';
import {TextInput, Image, Animated, Keyboard} from 'react-native-paper';
import { themeBlue } from '../../utils/colors';
const Register = ({navigation}) => {
  const {width, height} = Dimensions.get('screen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

  const nextHandler = () => {
    let validname, validemail, validpassword;

    if (password.length < 6 || confirmPassword.length < 6) {
      showToast(
        'Password too short 😥',
        'Password must contain at least 8 characters ',
        'error',
      );
      setPasswordError(true);
      setNameError(false);
      setEmailError(false);
      return;
    } else {
      if (password !== confirmPassword) {
        showToast('Passwords do not match 🚧', 'Please try again', 'error');
        setPasswordError(true);
        setNameError(false);
        setEmailError(false);
        return;
      }
      validpassword = password;
    }

    if (name.length == '') {
      showToast('Please Enter Your Name 😁', 'Please try again', 'error');
      setNameError(true);
      setPasswordError(false);
      setEmailError(false);
      return;
    } else {
      if (name.trim().length < 3) {
        showToast('Please Enter a Valid Name 😏', 'Please try again', 'error');
        setNameError(true);
        setPasswordError(false);
        setEmailError(false);
        return;
      }
      validname = name;
    }
    if (email.length == '') {
      showToast('Please Enter Your Email 😾', 'Please try again', 'error');
      setEmailError(true);
      setNameError(false);
      setPasswordError(false);
      return;
    } else {
      const emailIsValid = email => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
      if (!emailIsValid(email)) {
        showToast('Please Enter a Valid Email 😇', 'Please try again', 'error');
        setEmailError(true);
        setNameError(false);
        setPasswordError(false);
        return;
      }
      validemail = email;
    }
    setPasswordError(false);
    setNameError(false);
    setEmailError(false);
    if (validname && validemail && validpassword) {
      const data = {
        name: validname,
        email: validemail,
        password: validpassword,
      };
      navigation.navigate('register-two', data);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        height: height,
        backgroundColor: '#eeeeee',
        alignItems: 'center',
      }}
      // scrollEnabled={false}
      horizontal={false}
      showsVerticalScrollIndicator={false}>
      <RegisterSVG
        width={width / 1.25}
        style={{marginTop: 10}}
        height={height * 0.55}
      />
      <Toast />
      <View
        style={{
          transform: [
            {
              translateY: -height / 4.5,
            },
          ],
          width: width,
          zIndex: -2,

          borderRadius: 50,
          // alignItems: 'center',
          padding: 30,
          backgroundColor: '#978ED9',
        }}>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView>
            <Text
              style={{
                color: '#f5f5f5',
                marginTop: 50,
                marginBottom: 20,
                fontSize: 35,
                fontFamily:"Poppins-Medium"
              }}>
              Register 🙌
            </Text>
            <View>
              <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
                style={
                  nameError
                    ? {
                        borderBottomColor: 'red',
                        borderBottomWidth: 1,
                        backgroundColor: 'transparent',
                      }
                    : {backgroundColor: 'transparent'}
                }
                underlineStyle="flat"
                outlineColor={nameError ? 'red' : 'black'}
                activeUnderlineColor={nameError ? 'red' : 'black'}
                textColor="#f5f5f5"
                placeholder="You want us to call U by"
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
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
                activeUnderlineColor={emailError ? 'red' : 'black'}
                textColor="#f5f5f5"
                placeholder="Enter your email address...!"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                textColor="#f5f5f5"
                placeholder="Make sure it confidential "
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
                outlineColor="black"
                activeUnderlineColor="black"
              />
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                textColor="#f5f5f5"
                onChangeText={text => setConfirmPassword(text)}
                placeholder="Make sure it confidential "
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
                activeUnderlineColor={passwordError ? 'red' : 'black'}
              />
              <View
                style={{
                  alignItems: 'center',
                  margin: 20,
                  justifyContent: 'center',
                  height: 50,
                  backgroundColor: 'black',
                  borderRadius: 12,
                }}>
                <TouchableOpacity
                  style={{backgroundColor: 'black'}}
                  onPress={nextHandler}>
                  <Text style={{fontSize: 18, fontWeight: 600, color: '#fff'}}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 16, fontFamily:"Montserrat"}}>
            Already have an Account?
          </Text>
          <TouchableOpacity
              style={{backgroundColor: themeBlue, padding: 7.5, borderRadius: 10}}
                onPress={nextHandler}
              >
                <Text style={{ fontSize:14, fontFamily: 'Poppins-Medium'}}> Login </Text>
                </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({});
