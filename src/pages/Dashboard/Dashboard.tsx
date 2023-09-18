import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import ToggleButton from 'react-native-toggle-element';
import React, {useEffect, useState} from 'react';
import data from '../Habits/data';
import colors, {
  themeBlack,
  themeBlue,
  themeGreen,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightWhite,
  themeLightYellow,
  themePurple,
  themeRed,
  themeWhite,
  themeYellow,
} from '../../utils/colors';
import CrossIcon from '../../../assets/icons/cross.svg';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CalanderChart from '../../components/charts/CalanderChart';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import {LineChart} from 'react-native-chart-kit';
import {getDaysInAMonth} from '../../utils/data/getDaysInMonth';
const {width, height} = Dimensions.get('window');
const Dashboard = ({navigation}) => {
  const [toggleValue, setToggleValue] = useState(false);
  const habits = useSelector(state => state.tasks.habits);
  const [datesData, setDatesData] = useState<{id: String; data: any} | any>([
    {
      id: 'any',
      data: data,
    },
  ]);
  const [LoadingWaffle, setLoadingWaffle] = useState(true);
  const [dates, setDates] = useState(null);
  const [habitSelected, setHabitSelected] = useState(null);
  const [lineChartWeekWiseData, setLineChartWeekWiseData] = useState(null);
  const [lineChartMonthAverage, setLineChartMonthAverage] = useState(null);
  const [lineChartWeekData, setLineChartWeekData] = useState(null);
  console.log('=== HABIT SELECTED ===', habitSelected);

  const fetchDataByMonth = (
    month: number,
    year: number,
    i: any,
    habitSelected: any,
  ) => {
    const DatesAndWeeks = getDaysInAMonth(year, month);
    let weeks = [];
    let daysInAWeek = [];
    let currWeekProg = 0;
    let weekProgress = [];
    let monthProgress = [];
    DatesAndWeeks.forEach((item, ind) => {
      weeks.push(
        `${moment(item[0]).format('DD')} - ${moment(item[6]).format('DD')}`,
      );

      let AllDays = [];
      if (
        moment(moment(i.date).format('DD-MM-YY')).isBetween(
          moment(item[0]).format('DD-MM-YY'),
          moment(item[6]).format('DD-MM-YY'),
        )
      ) {
        // currWeek = item;
        item.forEach((j, index) => {
          let percentage = 0;
          habitSelected.dates.forEach(k => {
            if (
              moment(k.date).format('DD-MM-YYYY') ==
              moment(j).format('DD-MM-YYYY')
            ) {
              percentage = k.percentage;
            }
          });

          currWeekProg = ind + 1;
        });
      }
      let average = 0;
      item.forEach((j, index) => {
        let percentage = 0;
        habitSelected.dates.forEach(k => {
          if (
            moment(k.date).format('DD-MM-YYYY') ==
            moment(j).format('DD-MM-YYYY')
          ) {
            percentage = k.percentage;
            average += k.percentage;
          }
        });

        weekProgress.push({
          date: moment(j).format('DD-MM-YY'),
          percentage: percentage,
          week: ind + 1,
        });
      });
      if (!monthProgress.find(i => i.week == ind + 1)) {
        monthProgress.push(average / 7);
      }

      // i.forEach((j, index) => {

      // });
    });

    //Week Data
    //Month Data
    setLineChartWeekWiseData(weekProgress);
    setLineChartMonthAverage({
      label: weeks,
      data: monthProgress,
      month: month,
    });
    console.log('LABEL', weeks);
    console.log('=== CURRENT WEEK ===', currWeekProg);
    let currWeek = weekProgress.filter(i => i.week == currWeekProg);
    let labels = [];
    let data = [];

    currWeek.forEach(i => {
      labels.push(i.date.split('-')[0] + 'th');
      data.push(i.percentage);
    });
    setLineChartWeekData({
      label: labels,
      data: data,
      week: currWeekProg,
    });

    console.log('DAYS IN A WEEK', daysInAWeek);
    console.log('Week Progress', weekProgress);
    console.log('Month Progress', monthProgress);
  };
  useEffect(() => {
    habits &&
      habits.forEach(habitSelected => {
        setLoadingWaffle(true);
        if (habitSelected.dates.length > 0) {
          let thisTask;
          if (datesData.find(i => i.id == habitSelected._id)) {
            thisTask = datesData.find(i => i.id == habitSelected._id).data;
          } else {
            setDatesData(datesData => [
              ...datesData,
              {id: habitSelected._id, data: JSON.parse(JSON.stringify(data))},
            ]);
            thisTask = JSON.parse(JSON.stringify(data));
          }
          habitSelected.dates.map(i => {
            const month = moment(i.date).month();
            let week = moment(i.date).week();
            function weekOfMonth(m) {
              return moment(m).week() - moment(m).startOf('month').week() + 1;
            }
            week = Math.floor(weekOfMonth(month));
            console.log('== WEEK OF MONTH ==', week);
            const date = moment(i.date).date();
            const day = moment(i.date).day();
            console.log('== DATE ==', date);
            console.log('== DAY ==', day);

            // const copyData = JSON.parse(JSON.stringify(thisTask));
            console.log(Math.round(date / 7));
            console.log(date % 7);
            thisTask[month].progress[Math.floor(date / 7)][date % 7] =
              i.percentage;
            console.log('== DATA TO BE SET ==', thisTask);

            datesData.find(i => i.id == habitSelected._id)
              ? (datesData.find(i => i.id == habitSelected._id).data = thisTask)
              : setDatesData(prev => [
                  ...prev,
                  {id: habitSelected._id, data: thisTask},
                ]);
            setLoadingWaffle(false);

            //LineChart

            // if (datesData.find(i => i.id == _._id)) {
            //   const index = datesData.findIndex(
            //     dif => dif.id == _._id,
            //   );
            //   datesData[index].data = copyData;
            // } else {
            //   setDatesData(prev => [
            //     ...prev,
            //     {
            //       id: _._id,
            //       data: copyData,
            //     },
            //   ]);
            // }
            // thisTask = copyData;
            // arrayOfObjects.push({
            //   date: moment(i.date).format('YYYY-MM-DD'),
            //   count: Math.ceil(i.percentage / 20),
            // });
          });
          // setDatesData(arrayOfObjects);
        } else {
          if (!datesData.find(i => i.id == habitSelected._id)) {
            setDatesData(prev => [
              ...prev,
              {
                id: habitSelected._id,
                data: JSON.parse(JSON.stringify(data)),
              },
            ]);
          }
        }
      });
  }, []);
  useEffect(() => {
    if (habitSelected) {
      setLoadingWaffle(true);
      if (habitSelected.dates.length > 0) {
        let thisTask;
        if (datesData.find(i => i.id == habitSelected._id)) {
          thisTask = datesData.find(i => i.id == habitSelected._id).data;
        } else {
          setDatesData(datesData => [
            ...datesData,
            {id: habitSelected._id, data: JSON.parse(JSON.stringify(data))},
          ]);
          thisTask = JSON.parse(JSON.stringify(data));
        }
        habitSelected.dates.map(i => {
          const month = moment(i.date).month();
          let week = moment(i.date).week();
          function weekOfMonth(m) {
            return moment(m).week() - moment(m).startOf('month').week() + 1;
          }
          week = Math.floor(weekOfMonth(month));
          console.log('== WEEK OF MONTH ==', week);
          const date = moment(i.date).date();
          const day = moment(i.date).day();
          console.log('== DATE ==', date);
          console.log('== DAY ==', day);

          // const copyData = JSON.parse(JSON.stringify(thisTask));
          console.log(Math.round(date / 7));
          console.log(date % 7);
          thisTask[month].progress[Math.floor(date / 7)][date % 7] =
            i.percentage;
          console.log('== DATA TO BE SET ==', thisTask);

          datesData.find(i => i.id == habitSelected._id)
            ? (datesData.find(i => i.id == habitSelected._id).data = thisTask)
            : setDatesData(prev => [
                ...prev,
                {id: habitSelected._id, data: thisTask},
              ]);
          setLoadingWaffle(false);
          setDates(i);
          fetchDataByMonth(moment().month(), moment().year(), i, habitSelected);
          // if (datesData.find(i => i.id == _._id)) {
          //   const index = datesData.findIndex(
          //     dif => dif.id == _._id,
          //   );
          //   datesData[index].data = copyData;
          // } else {
          //   setDatesData(prev => [
          //     ...prev,
          //     {
          //       id: _._id,
          //       data: copyData,
          //     },
          //   ]);
          // }
          // thisTask = copyData;
          // arrayOfObjects.push({
          //   date: moment(i.date).format('YYYY-MM-DD'),
          //   count: Math.ceil(i.percentage / 20),
          // });
        });
        // setDatesData(arrayOfObjects);
      } else {
        if (!datesData.find(i => i.id == habitSelected._id)) {
          setDatesData(prev => [
            ...prev,
            {
              id: habitSelected._id,
              data: JSON.parse(JSON.stringify(data)),
            },
          ]);
        }
      }
      setLoadingWaffle(false);
    }
  }, [habitSelected]);
  // console.log(toggleValue);
  console.log('=== LINE CHART WEEK DATA ===', lineChartWeekData);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.crossIcon}>
          <CrossIcon width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.infoText}>Dashboard</Text>
        <TouchableOpacity style={{width: 30, height: 30}} />
      </View>

      <View
        style={{
          //   flexGrow: 1,
          width: width * 0.95,
          height: height * 0.05,
          marginVertical: height * 0.05,
          alignItems: 'center',
        }}>
        <ToggleButton
          value={toggleValue}
          onPress={newState => setToggleValue(newState)}
          thumbActiveComponent={
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-Bold',
                color: themeBlack,
              }}>
              Tasks
            </Text>
          }
          thumbInActiveComponent={
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-Bold',
                color: themeBlack,
              }}>
              Habits
            </Text>
          }
          thumbButton={{
            height: height * 0.075,
            // flexDirection: 'row',
            // justifyContent: 'center',
            // alignItems: 'center',
            activeBackgroundColor: themeBlue,
            inActiveBackgroundColor: themePurple,
            radius: 100,
            width: width * 0.225,
          }}
          trackBar={{
            activeBackgroundColor: themeBlack,
            inActiveBackgroundColor: '#000',
            borderActiveColor: themePurple,
            borderInActiveColor: themeBlue,
            borderWidth: 2,
            height: height * 0.075,
            width: width * 0.5,
          }}
        />
      </View>
      {!toggleValue ? (
        <ScrollView
          contentContainerStyle={{
            width: width * 0.95,
            paddingVertical: height * 0.025,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-Bold',
              color: themeWhite,
            }}>
            Select Habit
          </Text>
          <View>
            <ScrollView
              contentContainerStyle={{
                alignItems: 'center',
                gap: width * 0.05,
                paddingHorizontal: width * 0.05,
                marginVertical: height * 0.025,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {habits &&
                habits.map((habit, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setHabitSelected(habit);
                        setLineChartWeekData(null);
                        setLineChartWeekWiseData(null);
                        setLineChartMonthAverage(null);
                      }}
                      style={{
                        width: width * 0.4,
                        height: height * 0.25,
                        padding: 10,
                        opacity: habitSelected?._id === habit._id ? 1 : 0.75,
                        gap: 10,
                        backgroundColor: themeGrey,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor:
                          habitSelected?._id === habit._id
                            ? themeBlue
                            : 'black',
                        transform: [
                          {scale: habitSelected?._id === habit._id ? 1.1 : 1},
                        ],
                      }}
                      key={index}>
                      <Image
                        source={{uri: habit.habitIcon}}
                        style={{width: '99%', height: '75%', borderRadius: 20}}
                      />
                      <Text
                        style={{
                          fontSize: width * 0.03,
                          fontFamily: 'Montserrat-Bold',
                          color: themeWhite,
                          textAlign: 'center',
                        }}>
                        {habit.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            {/* //WaffleChart */}

            <View>
              {!LoadingWaffle && (
                <View
                  style={{
                    borderRadius: 20,
                    padding: 10,
                    backgroundColor: '#000',
                  }}>
                  {!LoadingWaffle && (
                    <CalanderChart
                      data={
                        habitSelected &&
                        datesData.find(i => i.id == habitSelected._id)
                          ? datesData.find(i => i.id == habitSelected._id).data
                          : data
                      }
                    />
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      width: width * 0.9,
                      marginTop: 10,
                      gap: 10,
                      paddingBottom: 20,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                          backgroundColor: themeGreen,
                        }}></View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Montserrat-Bold',
                          color: themeWhite,
                        }}>
                        - Completed
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                          backgroundColor: themeBlue,
                        }}></View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Montserrat-Bold',
                          color: themeWhite,
                        }}>
                        {'- Close ( > than 80%)'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                          backgroundColor: themeYellow,
                        }}></View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Montserrat-Bold',
                          color: themeWhite,
                        }}>
                        {'- Half Progress ( > than 50%)'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                          backgroundColor: themeRed,
                        }}></View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Montserrat-Bold',
                          color: themeWhite,
                        }}>
                        {'- Missed ( > than 30%)'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {/* //Weekly Analysis */}
              {lineChartWeekData && (
                <View
                  style={{
                    width: width * 0.95,
                    marginVertical: height * 0.055,
                    borderRadius: 20,
                    paddingTop: 10,
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#000',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'Montserrat-Bold',
                      color: themeWhite,
                    }}>
                    Weekly Analysis
                  </Text>
                  <View
                    style={{
                      marginVertical: 10,
                      width: width * 0.95,
                      paddingHorizontal: 10,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 100,
                        padding: 10,
                        backgroundColor: themeBlack,
                      }}
                      onPress={() => {
                        const currWeek = lineChartWeekData?.week;
                        if (currWeek > 1) {
                          let nextWeek = lineChartWeekWiseData?.filter(
                            i => i.week == currWeek - 1,
                          );
                          let labels = [];
                          let data = [];

                          nextWeek.forEach(i => {
                            labels.push(i.date.split('-')[0] + 'th');
                            data.push(i.percentage);
                          });
                          setLineChartWeekData({
                            label: labels,
                            data: data,
                            week: currWeek - 1,
                          });
                        }
                      }}>
                      <LeftArrow width={40} height={40} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Montserrat-Bold',
                        color: themeWhite,
                      }}>
                      {lineChartWeekData &&
                        lineChartWeekData.label[1] +
                          ' - ' +
                          lineChartWeekData.label[6]}
                    </Text>
                    <TouchableOpacity
                      style={{
                        borderRadius: 100,
                        padding: 10,
                        backgroundColor: themeBlack,
                      }}
                      onPress={() => {
                        const currWeek = lineChartWeekData.week;
                        const maxWeeks =
                          lineChartWeekWiseData[
                            lineChartWeekWiseData.length - 1
                          ].week;
                        if (currWeek < maxWeeks) {
                          let nextWeek = lineChartWeekWiseData.filter(
                            i => i.week == currWeek + 1,
                          );
                          let labels = [];
                          let data = [];

                          nextWeek.forEach(i => {
                            labels.push(i.date.split('-')[0] + 'th');
                            data.push(i.percentage);
                          });
                          setLineChartWeekData({
                            label: labels,
                            data: data,
                            week: currWeek + 1,
                          });
                        }
                      }}>
                      <RightArrow width={40} height={40} />
                    </TouchableOpacity>
                  </View>
                  {/* {lineChartWeekData &&
                    lineChartWeekData.label &&
                    lineChartWeekData.data && (
                      <LineChart
                        data={{
                          labels: lineChartWeekData.label,
                          datasets: [
                            {
                              data: lineChartWeekData.data,
                            },
                          ],
                        }}
                        width={width * 0.95} // from react-native
                        height={300}
                        yAxisLabel=""
                        yAxisSuffix="%"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                          backgroundColor: '#000',
                          backgroundGradientFrom: themeBlack,
                          backgroundGradientTo: themeBlue,
                          decimalPlaces: 2, // optional, defaults to 2dp
                          color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity}))`,
                          labelColor: (opacity = 1) => themeWhite,
                          style: {
                            borderRadius: 16,
                          },
                          propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: themeRed,
                          },
                        }}
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      />
                    )} */}
                </View>
              )}
              {/* {lineChartMonthAverage && (
                <View
                  style={{
                    width: width * 0.95,
                    // marginVertical: height * 0.055,
                    borderRadius: 20,
                    paddingTop: 10,
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#000',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'Montserrat-Bold',
                      color: themeWhite,
                    }}>
                    Monthly Analysis
                  </Text>
                  <View
                    style={{
                      marginVertical: 10,
                      width: width * 0.95,
                      paddingHorizontal: 10,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 100,
                        padding: 10,
                        backgroundColor: themeBlack,
                      }}
                      onPress={() => {
                        const currWeek = lineChartMonthAverage.month;
                        if (currWeek > 0) {
                          fetchDataByMonth(
                            currWeek - 1,
                            2023,
                            dates,
                            habitSelected,
                          );
                          // let labels = [];
                          // let data = [];

                          // nextWeek.forEach(i => {
                          //   labels.push(i.date.split('-')[0] + 'th');
                          //   data.push(i.percentage);
                          // });
                          // setLineChartWeekData({
                          //   label: labels,
                          //   data: data,
                          //   week: currWeek - 1,
                          // });
                        }
                      }}>
                      <LeftArrow width={40} height={40} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Montserrat-Bold',
                        color: themeWhite,
                      }}>
                      {lineChartMonthAverage &&
                        moment()
                          .set('month', lineChartMonthAverage.month)
                          .set('year', 2023)
                          .format('MMMM')}
                    </Text>
                    <TouchableOpacity
                      style={{
                        borderRadius: 100,
                        padding: 10,
                        backgroundColor: themeBlack,
                      }}
                      onPress={() => {
                        const currWeek = lineChartMonthAverage.month;
                        if (currWeek < 11) {
                          fetchDataByMonth(
                            currWeek + 1,
                            2023,
                            dates,
                            habitSelected,
                          );
                        }
                      }}>
                      <RightArrow width={40} height={40} />
                    </TouchableOpacity>
                  </View>
                  {lineChartMonthAverage && (
                    <LineChart
                      data={{
                        labels: lineChartMonthAverage.label,
                        datasets: [
                          {
                            data: lineChartMonthAverage.data,
                          },
                        ],
                      }}
                      width={width * 0.95} // from react-native
                      height={300}
                      yAxisLabel=""
                      yAxisSuffix="%"
                      yAxisInterval={1} // optional, defaults to 1
                      chartConfig={{
                        backgroundColor: '#000',
                        backgroundGradientFrom: themePurple,
                        backgroundGradientTo: themeRed,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => themeBlack,
                        labelColor: (opacity = 1) => themeWhite,
                        style: {
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: '6',
                          strokeWidth: '2',
                          stroke: themeRed,
                        },
                      }}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    />
                  )}
                </View>
              )} */}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: themeWhite,
              fontFamily: 'Montserrat-Bold',
              fontSize: 20,
            }}>
            We're Working On This..! 😅
          </Text>
        </View>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingTop: 10,
    position: 'relative',
    paddingRight: 15,
    backgroundColor: colors.themeBlack,
  },
  infoText: {
    fontSize: 24,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    color: colors.themePurple,
  },
  infoContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  crossIcon: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
