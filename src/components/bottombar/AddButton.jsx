import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Plus from '../../../assets/icons/plus.svg';
import CreateIcon from '../../../assets/icons/pencil.svg';
import colors from '../../utils/colors';
const AddButton = ({opened, toggleOpened, navigation}) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      friction: 2,
    }).start();
  }, [opened, animation]);
  const opacity = {
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    }),
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity>
          <Animated.View
            style={[
              styles.items,
              opacity,
              {
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}>
            <Image
              source={require('../../../assets/icons/diary-icon.png')}
              styles={styles.itemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.items,
            opacity,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('create-task');
            }}>
            <CreateIcon width={35} height={35} />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity>
          <Animated.View
            style={[
              styles.items,
              opacity,
              {
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}>
            <Image
              source={require('../../../assets/icons/diary-icon.png')}
              styles={styles.itemIcon}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleOpened} style={styles.addButton}>
          <Animated.View
            style={[
              styles.addButtonInner,
              {
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg'],
                    }),
                  },
                ],
              },
            ]}>
            <Plus width={35} height={35} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddButton;
// rgb(89, 91, 212);
// rgb(31, 107, 255);
// rgb(31, 107, 255);
// rgb(102, 23, 27);
// rgb(90, 34, 38);
// rgb(86, 41, 45);
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,

    height: 0,
  },
  addButton: {
    shadowColor: 'rgba(78, 49, 170,0.5)',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },
  box: {
    position: 'relative',
    width: 70,
    height: 70,
    marginTop: -30,
  },
  addButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    //#595BD4
    backgroundColor: 'rgba(88, 91, 212,1)',
    width: 60,
    borderRadius: 30,
    height: 60,
  },
  items: {
    position: 'absolute',
    top: 5,
    left: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeGrey,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemIcon: {
    tintColor: 'black',
  },
});
