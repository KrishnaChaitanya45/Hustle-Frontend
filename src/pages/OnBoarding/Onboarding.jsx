import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import React from 'react';
import Goal from '../../../assets/images/goal-3d.svg';
const colors = ['rgb(108,28,28)', '#33658A', '#8EB19D'];
const onecolors = ['#CDE6F5', '#FFEAAE', '#FFFFEA'];

//theme  1 for diary - background - #684551 - design - #CDE6F5 for goal design - #FFEAAE
//

const Onboarding = ({navigation}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const {width, height} = Dimensions.get('screen'); // to get the screen dimension

  const Backdrop = ({scrollX}) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: colors.map((_, i) => i * width),
      outputRange: colors.map(slide => slide),
    });
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor,
          },
        ]}
      />
    );
  };
  const Indicator = ({scrollX}) => {
    return (
      <View style={{flexDirection: 'row', position: 'absolute', bottom: 50}}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0.6, 0.9, 0.6],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`indicator-${i}`}
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: '#fff',
                opacity,
                margin: 8,
                transform: [{scale}],
              }}></Animated.View>
          );
        })}
      </View>
    );
  };
  const Square = ({scrollX}) => {
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width),
      ),
      1,
    );
    const rotate = YOLO.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['0deg', '45deg', '75deg', '45deg', '0deg'],
    });
    const translateX = YOLO.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -50, -100, 50, 0],
    });
    const backgroundColor = scrollX.interpolate({
      inputRange: onecolors.map((_, i) => i * width),
      outputRange: onecolors.map(slide => slide),
    });
    return (
      <Animated.View
        style={{
          width: width * 1.35,
          height: height,
          backgroundColor,
          borderRadius: 200,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.51,
          shadowRadius: 13.16,
          elevation: 20,

          position: 'absolute',
          top: -height / 2.15,

          transform: [
            {
              rotate,
            },
            {
              translateX,
            },
          ],
        }}
      />
    );
  };
  const slides = [
    {
      id: 1,
      title: 'Diary',
      image: require('../../../assets/images/diary.png'),
      video: '../../../assets/images/diary.mp4',
      subtitle: 'Write your diary here..',
    },
    {
      id: 2,
      title: 'Goal Tracker',
      image: require('../../../assets/images/goal-3d.svg'),
      video: '../../../assets/videos/diary.mp4',
      subtitle: 'Goals here',
    },
    {
      id: 3,
      title: 'Community',
      image: require('../../../assets/images/community.png'),
      video: '../../../assets/videos/diary.mp4',
      subtitle: 'Community here',
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />
      <Animated.FlatList
        data={slides}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        contentContainerStyle={{paddingBottom: 100}}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}>
              <View
                style={{
                  flex: 0.7,
                  justifyContent: 'center',
                }}>
                {index == 1 ? (
                  <Goal width={width} height={height / 2} style={{zIndex: 5}} />
                ) : (
                  <Image
                    source={item.image}
                    key={index}
                    style={{
                      width: width,
                      height: 350,
                    }}
                    resizeMethod="resize"
                  />
                )}
              </View>
              <View style={{flex: 0.3}}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 30,
                    textAlign: 'center',
                    marginTop: 30,
                    fontFamily: Platform.select({
                      ios: 'Avenir',
                      android: 'Lato',
                    }),
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 20,
                    marginTop: 20,
                    textAlign: 'center',
                  }}>
                  {item.subtitle}
                </Text>
              </View>
              {index === 2 && (
                <Button
                  title="Get Started"
                  onPress={() => navigation.navigate('login')}
                />
              )}
            </View>
          );
        }}
      />
      <Indicator scrollX={scrollX} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({});
