import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, startTransition} from 'react';
import moment from 'moment';
import colors from '../../utils/colors';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import {TextInput} from 'react-native-paper';
const WeekCalander = ({
  startDate,
  setStartDate,
  endDate,
  variant,
  setEndDate,
  clicked,
  setClicked,
}) => {
  const [currentWeek, setCurrentWeek] = useState(moment());

  const [startIndex, setStartIndex] = useState(null);
  const [endIndex, setEndIndex] = useState(null);

  const handleWeekChange = direction => {
    const newWeek = moment(currentWeek).add(
      direction === 'next' ? 1 : -1,
      'week',
    );
    setCurrentWeek(newWeek);
  };
  const startOfWeek = moment(currentWeek).startOf('week');
  const endOfWeek = moment(currentWeek).endOf('week');

  return (
    <View styles={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleWeekChange('prev')}>
          <LeftArrow width={30} height={30} />
        </TouchableOpacity>
        <Text
          style={[
            styles.weekText,
            {
              color: variant ? colors.themeWhite : colors.themeBlue,
            },
          ]}>{`${startOfWeek.format('D  MMM')} - ${endOfWeek.format(
          'D  MMM',
        )}`}</Text>
        <TouchableOpacity onPress={() => handleWeekChange('next')}>
          <RightArrow width={30} height={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.days}>
        {moment.weekdaysShort().map((day, index) => {
          const date = moment(currentWeek)
            .startOf('week')
            .add(moment.weekdaysShort().indexOf(day), 'day');
          let betweenDates = [];
          let disabaledDates = [];
          if (startDate && endDate) {
            let currDate = moment(startDate).startOf('day');
            let lastDate = moment(endDate).startOf('day');
            while (currDate.add(1, 'days').diff(lastDate) < 0) {
              betweenDates.push(currDate.clone().format('D MMM YYYY'));
            }
          }
          if (variant) {
            let currDate = moment(variant.start)
              .subtract(1, 'days')
              .startOf('day');
            let lastDate = moment(variant.end).startOf('day');
            while (currDate.add(1, 'days').diff(lastDate) <= 0) {
              disabaledDates.push(currDate.clone().format('D MMM YYYY'));
            }
          }

          return (
            <TouchableOpacity
              style={[
                styles.dateAndDayContainer,
                {
                  borderColor: !variant
                    ? moment(date).format('YYYY-MM-DD') ===
                        moment(startDate).format('YYYY-MM-DD') ||
                      moment(date).format('YYYY-MM-DD') ===
                        moment(endDate).format('YYYY-MM-DD')
                      ? colors.themeYellow
                      : betweenDates.indexOf(date.format('D MMM YYYY')) !== -1
                      ? colors.themePurple
                      : colors.themeBlack
                    : colors.themeGrey,
                  backgroundColor:
                    disabaledDates.length > 0 &&
                    disabaledDates.indexOf(date.format('D MMM YYYY')) === -1
                      ? colors.themeWhite
                      : moment(date).format('YYYY-MM-DD') ===
                          moment(startDate).format('YYYY-MM-DD') ||
                        moment(date).format('YYYY-MM-DD') ===
                          moment(endDate).format('YYYY-MM-DD')
                      ? colors.themeBlack
                      : betweenDates.indexOf(date.format('D MMM YYYY')) !== -1
                      ? !variant
                        ? 'transparent'
                        : colors.themeGrey
                      : 'transparent',
                },
              ]}
              key={Math.random().toString()}
              onPress={() => {
                if (disabaledDates.length > 0) {
                  if (
                    disabaledDates.indexOf(date.format('D MMM YYYY')) !== -1
                  ) {
                    if (clicked < 1) {
                      if (startIndex === index || endIndex === index) {
                        setClicked(0);
                        setStartDate(null);
                        setStartIndex(null);
                        return;
                      } else if (startIndex !== null) {
                        setClicked(clicked + 1);
                        setStartDate(date.format('YYYY-MM-DD'));
                        setStartIndex(index);
                        return;
                      }
                      setClicked(clicked + 1);
                      setStartDate(date.format('YYYY-MM-DD'));
                      setStartIndex(index);
                    } else if (clicked === 1) {
                      setEndDate(date.format('YYYY-MM-DD'));
                      setEndIndex(index);
                      setClicked(clicked + 1);
                    } else {
                      setEndDate(null);
                      setEndIndex(null);
                      setClicked(0);
                      setStartIndex(null);
                    }
                  } else {
                    return;
                  }
                }

                if (clicked < 1) {
                  if (startIndex === index || endIndex === index) {
                    setClicked(0);
                    setStartDate(null);
                    setStartIndex(null);
                    return;
                  } else if (startIndex !== null) {
                    setClicked(clicked + 1);
                    setStartDate(date.format('YYYY-MM-DD'));
                    setStartIndex(index);
                    return;
                  }
                  setClicked(clicked + 1);
                  setStartDate(date.format('YYYY-MM-DD'));
                  setStartIndex(index);
                } else if (clicked === 1) {
                  setEndDate(date.format('YYYY-MM-DD'));
                  setEndIndex(index);
                  setClicked(clicked + 1);
                } else {
                  setEndDate(null);
                  setEndIndex(null);
                  setClicked(0);
                  setStartIndex(null);
                }
              }}>
              <Text
                style={[
                  styles.dayText,
                  {
                    color:
                      disabaledDates.length > 0 &&
                      disabaledDates.indexOf(date.format('D MMM YYYY')) === -1
                        ? colors.themeGrey
                        : moment(date).format('YYYY-MM-DD') ===
                            moment(startDate).format('YYYY-MM-DD') ||
                          moment(date).format('YYYY-MM-DD') ===
                            moment(endDate).format('YYYY-MM-DD')
                        ? colors.themeYellow
                        : betweenDates.indexOf(date.format('D MMM YYYY')) !== -1
                        ? !variant
                          ? colors.themeWhite
                          : colors.themeBlack
                        : colors.themeWhite,
                  },
                ]}
                key={Math.random().toString()}>
                {day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  {
                    color:
                      disabaledDates.length > 0 &&
                      disabaledDates.indexOf(date.format('D MMM YYYY')) === -1
                        ? colors.themeGrey
                        : moment(date).format('YYYY-MM-DD') ===
                            moment(startDate).format('YYYY-MM-DD') ||
                          moment(date).format('YYYY-MM-DD') ===
                            moment(endDate).format('YYYY-MM-DD')
                        ? colors.themeYellow
                        : betweenDates.indexOf(date.format('D MMM YYYY')) !== -1
                        ? !variant
                          ? colors.themeWhite
                          : colors.themeBlack
                        : colors.themeWhite,
                  },
                ]}
                key={Math.random().toString()}>
                {date.format('D')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WeekCalander;

const styles = StyleSheet.create({
  container: {
    height: 200,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  weekText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  days: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 5,
    justifyContent: 'space-between',
  },
  dateAndDayContainer: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,

    paddingLeft: 8.5,
    paddingRight: 8.5,
    paddingTop: 5,
    paddingBottom: 5,
    gap: 5,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Lato-Medium',
    color: colors.themeWhite,
    opacity: 0.85,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: colors.themeWhite,
  },
  inputContainer: {
    marginTop: 20,

    gap: 10,
  },
});
