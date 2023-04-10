import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTabMenu} from '../../contexts/TabContexts';

const TabContainer = ({children}) => {
  const {opened} = useTabMenu();
  const animation = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      friction: 2,
    }).start();
  }, [opened, animation]);
  return (
    <View style={styles.container}>
      {children}
      {opened && (
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['#17181A', 'rgba(0,0,0,0.75)'],
              }),
            },
          ]}
        />
      )}
    </View>
  );
};

export default TabContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
});
