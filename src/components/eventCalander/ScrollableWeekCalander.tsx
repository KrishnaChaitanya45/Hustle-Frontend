import * as React from 'react';
import {
  Vibration,
  StatusBar,
  Easing,
  Animated,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import moment from 'moment';
import getData from '../../utils/data/getYearlyData';
import {
  themeBlack,
  themeGrey,
  themeLightBlue,
  themeWhite,
} from '../../utils/colors';
const {width, height} = Dimensions.get('window');

const colors = {
  black: '#323F4E',
  blue: '#DEECEC',
  red: '#F76A6A',
  text: '#ffffff',
};
const months = moment.monthsShort();

const ITEM_SIZE = width * 0.2;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;
/* */
const ScrollableWeekCalander = ({
  selectedDate,
  setSelectedDate,
  currentActiveMonth,
  setCurrentActiveMonth,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
  currentActiveMonth: number;
  setCurrentActiveMonth: React.Dispatch<React.SetStateAction<number>>;
}) => {
  //@ts-ignore
  const getItemLayout = (_, index: number) => ({
    length: ITEM_SIZE,
    offset: ITEM_SIZE * index,
    index,
  });
  //   const [selectedDate, setSelectedDate] = React.useState(moment());

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  const [data, setData] = React.useState(getData());
  const [activeDates, setActiveDates] = React.useState<any>();

  const MonthsListRef = React.useRef<FlatList>(null);
  const datesRef = React.useRef<FlatList>(null);
  React.useEffect(() => {
    if (!isDragging) {
      MonthsListRef.current?.scrollToIndex({
        index: moment().month(),
        animated: true,
      });
      setActiveDates(
        data.filter(
          (item: any) => moment(item.key).month() === moment().month(),
        ),
        );
      

      if (data.filter(
        (item: any) => moment(item.key).month() === moment().month(),
      )) {
        const index = data.find((date)=>{
          return moment(date.key).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')
        })!.date;
        console.log("===INDEX ===", index);
        if(index && activeDates  ){
          
          datesRef.current?.scrollToIndex({
            index:index-6
          });
          // datesRef.current?.scrollToIndex({
          //   index:index,
          //   animated: true,
          // });
        }
       
      }
    }
  }, [activeDates && activeDates.length]);
  const renderItem = ({item}: {item: any}) => {
    const isSelected = selectedDate.isSame(item.key, 'day')
      ? {backgroundColor: themeLightBlue, color: 'black'}
      : {color: themeWhite};
    return (
      <TouchableOpacity
        style={{justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
          setSelectedDate(moment(item.key));
        }}>
        <View
          style={[
            isSelected,
            {
              paddingBottom: 2.5,
              paddingTop: 2.5,
              paddingLeft: 10,
              borderRadius: 12,
              paddingRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            },
          ]}>
          <Text
            style={{fontFamily: 'Poppins-Medium', fontSize: 12, color: 'grey'}}>
            {item.dayOfWeek}
          </Text>
          <Text
            style={[
              {
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: selectedDate.isSame(item.key, 'day')
                  ? themeBlack
                  : themeWhite,
              },
            ]}>
            {item.date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePress = (index: number) => {
    MonthsListRef.current?.scrollToIndex({
      index: index,
      animated: true,
    });
    const fetchedDates = data.filter(item => {
      return moment(item.key).month() === index;
    });
    setActiveDates(fetchedDates);
    setCurrentActiveMonth(index);
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          flex: 1,
        }}>
        <Animated.FlatList
          data={months}
          ref={MonthsListRef}
          getItemLayout={getItemLayout}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          bounces={false}
          style={{flexGrow: 0}}
          onScrollBeginDrag={e => {
            setIsDragging(true);
          }}
          onScrollEndDrag={e => {
            setIsDragging(false);
            // setData(prev =>
            //   prev.filter(
            //     item =>
            //       moment(item.key).month() ===
            //       Math.ceil(e.nativeEvent.contentOffset.x / ITEM_SIZE),
            //   ),
            // );
            const fetchedDates = data.filter(item => {
              console.log(
                'fromScroll' +
                  Math.ceil(e.nativeEvent.contentOffset.x / ITEM_SIZE),
              );
              console.log('from Data' + moment(item.key).month());
              return (
                moment(item.key).month() ===
                Math.ceil(e.nativeEvent.contentOffset.x / ITEM_SIZE)
              );
            });
            console.log(fetchedDates);
            setActiveDates(fetchedDates);
            setCurrentActiveMonth(
              Math.ceil(e.nativeEvent.contentOffset.x / ITEM_SIZE),
            );
          }}
          snapToInterval={ITEM_SIZE}
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          renderItem={({item, index}) => {
            if (index >= 0) {
              const inputRange = [
                (index - 2) * ITEM_SIZE,
                (index - 1) * ITEM_SIZE,
                index * ITEM_SIZE,
                (index + 1) * ITEM_SIZE,
                (index + 2) * ITEM_SIZE,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 0.7, 1, 0.7, 0.4],
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.5, 0.7, 1, 0.7, 0.5],
              });

              return (
                <View
                  key={index}
                  style={{
                    width: ITEM_SIZE,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => handlePress(index)}>
                    <Animated.Text
                      style={[
                        styles.text,
                        {
                          opacity,
                          transform: [
                            {
                              scale,
                            },
                          ],
                        },
                      ]}>
                      {item}
                    </Animated.Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return <View style={{width: ITEM_SPACING}} />;
            }
          }}
        />
      </View>
      <View style={{width: '100%', marginTop: '20%'}}>
        <Animated.FlatList
          data={activeDates}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          horizontal
          bounces={false}
          ref={datesRef}
          contentContainerStyle={{
            gap: 20,
            paddingHorizontal: width * 0.05,
            justifyContent: 'space-evenly',
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key.toString()}
        />
      </View>
    </View>
  );
};

export default ScrollableWeekCalander;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: ITEM_SIZE * 0.4,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
});
