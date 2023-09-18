import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {MotiView} from 'moti';
import {
  themeBlack,
  themeBlue,
  themeGreen,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightYellow,
  themePurple,
  themeRed,
  themeWhite,
  themeYellow,
} from '../../utils/colors';
import {Title} from 'react-native-paper';
import {set} from 'react-native-reanimated';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
const ITEM_SIZE = width * 0.9;
const getItemLayout = (_, index: number) => ({
  length: ITEM_SIZE,
  offset: ITEM_SIZE * index,
  index,
});
const WeekContainer = ({
  data,
  index,
  scrollX,
  extraData,
}: {
  data: {month: string; progress: any};
  index: number;
  scrollX: Animated.Value;
  extraData: number;
}) => {
  //   const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  //   const outputRange = [0.4, 1, 0.4];
  //   const scale = scrollX.interpolate({
  //     inputRange,
  //     outputRange,
  //   });

  return (
    <View style={styles.parentContainer}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Montserrat-Medium',
          color: themeWhite,
          marginBottom: 10,
        }}>
        {data.month}
      </Text>
      <Animated.View
        style={[
          styles.weeksContainer,
          {
            // opacity: scale,
          },
        ]}>
        {data.progress.map((week, i) => {
          return (
            <View style={styles.indWeekContainer} key={i}>
              {week.map((day, ind) => {
                return (
                  <View
                    key={extraData + ind}
                    style={[
                      styles.indDay,
                      {
                        backgroundColor:
                          Number(day) == 0
                            ? themeGrey
                            : Number(day <= 30)
                            ? themeRed
                            : Number(day) <= 50
                            ? themeYellow
                            : Number(day) <= 70
                            ? themeBlue
                            : Number(day) <= 100
                            ? themeGreen
                            : themeBlack,
                      },
                    ]}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color:
                          Number(day) == 0
                            ? themeLightBlue
                            : Number(day <= 30)
                            ? themeLightYellow
                            : Number(day) <= 60
                            ? themeLightBlue
                            : Number(day) <= 70
                            ? themeLightGreen
                            : Number(day) <= 100
                            ? themeBlack
                            : themeLightBlue,
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      {ind + 7 * i}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};
const CalanderChart = ({data}) => {
  const [extraData, setExtraData] = useState(1);
  const chart = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    chart.current.scrollToIndex({index: moment().month(), animated: true});
  }, []);
  return (
    <View style={styles.parentContainer}>
      <Animated.FlatList
        ref={chart}
        getItemLayout={getItemLayout}
        keyExtractor={item => item.month}
        data={data}
        extraData={extraData}
        renderItem={({item, index}) => (
          <WeekContainer
            data={item}
            index={index}
            scrollX={scrollX}
            extraData={extraData}
          />
        )}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: true,
          },
        )}
        onScrollEndDrag={() => {
          setExtraData(prev => prev + 1);
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default CalanderChart;

const styles = StyleSheet.create({
  parentContainer: {
    width: width * 0.9,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 10,
  },
  weeksContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: height * 0.01,
  },
  indWeekContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: width * 0.025,
  },
  indDay: {
    height: 25,
    width: 25,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: themeGrey,
    shadowColor: themeGrey,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    elevation: 10,
  },
});
