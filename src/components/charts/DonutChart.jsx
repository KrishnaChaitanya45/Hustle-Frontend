import {StyleSheet, Text, View, Animated, Image} from 'react-native';
import React from 'react';
import Svg, {G, Circle} from 'react-native-svg';
const DonutChart = ({
  percentage,
  radius,
  strokeWidth = 10,
  color,
  delay = 700,
  duration = 2000,
  max = 100,
  image,
  text,
}) => {
  const circleRef = React.useRef();
  const halfCircle = radius + strokeWidth;
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const circleCircumference = 2 * Math.PI * (radius > 0 ? radius : 50);
  const animation = toValue => {
    return Animated.timing(animatedValue, {
      toValue,
      delay,
      duration,
      useNativeDriver: true,
    }).start(() => animation(toValue));
  };

  React.useEffect(() => {
    animation(percentage > 0 ? percentage : 0);
    animatedValue.addListener(v => {
      if (circleRef?.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPerc) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, []);
  return (
    <View style={{position: 'relative'}}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={` 0 0 ${halfCircle * 2} ${halfCircle * 2}`}
        style={{zIndex: 5}}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color ? color : 'tomato'}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={color ? color : 'tomato'}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {image && (
        <Image
          source={image}
          width={radius * 1.25}
          height={radius * 1.25}
          resizeMode="cover"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [
                {translateX: (radius / 1.5) * 0.5},
                {translateY: (radius / 1.5) * 0.5},
              ],
              borderRadius: 100,
            },
          ]}
        />
      )}
      {text && (
        <Text
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: radius / 3,
              transform: [
                {translateX: (radius / 10) * 0.5},
                {translateY: (radius / 15) * 0.1},
              ],
              color: color ? color : 'tomato',
            },
          ]}>
          {text > 0 ? text : 0} %
        </Text>
      )}
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  image: {
    width: '70%',
    height: '70%',
    borderRadius: 100,
    position: 'absolute',
  },
});
