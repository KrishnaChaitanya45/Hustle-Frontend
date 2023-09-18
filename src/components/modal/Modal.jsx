import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import FireIcon from '../../../assets/icons/fire.svg';
import {
  themeBlack,
  themeGrey,
  themeLightWhite,
  themeLightYellow,
} from '../../utils/colors';
import Lottie from 'lottie-react-native';
import FireIconAnimaton from '../../../assets/videos/fire-animation.json';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
const PopUpModal = ({modalVisible, setModalVisible, points}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const [left, setLeft] = useState(0);
  const scale = useRef(new Animated.Value(0)).current;

  const toggleClose = open => {
    if (open) {
      setModalVisible(true);
      Animated.spring(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setModalVisible(false), 300);
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  useEffect(() => {
    setModalVisible(false);
    toggleClose(modalVisible);
  }, [modalVisible]);
  return (
    <Modal
      transparent
      visible={modalVisible}
      style={{
        position: 'absolute',
        top: 0,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          toggleClose(false);
        }}>
        <Animated.View
          style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            width: '80%',
            padding: '5%',
            borderRadius: 10,
            transform: [{scale}],
            opacity: scale,
            alignItems: 'center',
          }}>
          <Lottie
            source={FireIconAnimaton}
            autoPlay
            loop
            style={{
              width: '70%',
              height: 100,
            }}
          />
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Poppins-Medium',
              color: themeBlack,
            }}>
            {' '}
            You are on Fire!{' '}
          </Text>

          <GestureHandlerRootView>
            <View style={styles.firePoints}>
              <View
                style={[
                  styles.fireIcon,
                  {
                    left: left,
                  },
                ]}>
                <FireIcon width={30} height={30} />
              </View>
              <Text style={styles.firePointsText}>{points || '0'}</Text>
            </View>
          </GestureHandlerRootView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PopUpModal;

const styles = StyleSheet.create({
  firePoints: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 5,
    backgroundColor: themeBlack,
    width: 140,
    height: 40,
    marginTop: '5%',
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  fireIcon: {
    position: 'absolute',
    top: 0,

    borderRadius: 50,
    padding: 5,
    backgroundColor: themeLightYellow,
    height: 40,
    width: 80,
    alignItems: 'center',
  },
  firePointsText: {
    width: '50%',
    position: 'absolute',
    right: 0,
    color: themeLightWhite,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
});
