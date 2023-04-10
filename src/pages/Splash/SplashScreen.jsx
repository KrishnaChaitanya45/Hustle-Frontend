import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

const Splash = ({navigation}) => {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  };

  return (
    <View
      style={{
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: 'white'}}>Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
