import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import React from 'react';
import {
  themeBlack,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightWhite,
  themeLightYellow,
  themeWhite,
  themeYellow,
} from '../../utils/colors';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import DoneIcon from '../../../assets/icons/check-circle.svg';
//@ts-ignore
import ClockIcon from '../../../assets/icons/clocktask.svg';
import {useSelector} from 'react-redux';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
const StepperComponent = ({data, navigation}: {data: any; navigation: any}) => {
  const linesHeight = data ? data.length * (height * 0.2) : 0;
  const cardsHeight = data
    ? data.map(
        (item: any) => item.tasks.length * 70 + item.habits.length * 70 + 10,
      )
    : 100;
  const AllTasks = useSelector((state: any) => state.tasks);
  const AllHabits = useSelector((state: any) => state.tasks.habits);
  const totalContainerHeight =
    linesHeight + cardsHeight.reduce((a: any, b: any) => a + b, 0);
  console.log(totalContainerHeight);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          height: totalContainerHeight + 100,
        },
      ]}
      horizontal={false}
      showsVerticalScrollIndicator={false}>
      <ScrollView contentContainerStyle={[styles.stepContainer, {}]}>
        {data &&
          data.map((item: any, index: any) => {
            const generateRandomColor = () => {
              const cardColor = [
                themeLightGreen,
                themeLightWhite,
                themeLightYellow,
                themeLightBlue,
              ][Math.floor(Math.random() * 4)];
              return cardColor;
            };
            return (
              <View key={index}>
                <View
                  style={[
                    styles.firstStep,
                    {
                      marginTop: index > 0 ? height * 0.05 : 0,
                      height: item.tasks.length * 70 + 10,
                    },
                  ]}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={styles.stepCircle}></View>
                  <View style={styles.stepContent}>
                    {item.tasks &&
                      item.tasks.map((item: any, index: any) => {
                        // console.log(item.duration);
                        const task = AllTasks.tasks.find(
                          (task: any) => task.title === item.title,
                        );

                        return (
                          <TouchableOpacity
                            style={[
                              styles.indTaskCard,
                              {
                                backgroundColor: item.isCompleted
                                  ? themeLightGreen
                                  : themeLightWhite,
                              },
                            ]}
                            key={index}
                            onPress={() => {
                              navigation.navigate('ind-task', {task: task});
                            }}>
                            <View style={styles.headingAndTime}>
                              <Text style={styles.TaskHeading}>
                                {item.title.slice(0, 10)}...
                              </Text>
                              <View style={styles.TaskTime}>
                                <ClockIcon width={20} height={20} />
                                <Text style={styles.TaskTimeText}>
                                  {item.isCompleted ? '✅' : item.duration}
                                </Text>
                              </View>
                            </View>
                            {/* //TODO Add the done mark */}
                            {/* <View style={{position:"absolute", top:-10, zIndex:100 }}>
                           <DoneIcon style={{width:50 , height:50}}  />
                           </View> */}
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text style={styles.TaskDescription}>
                                {item.description.slice(0, 40)}...
                              </Text>

                              {/* </Button> */}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    {item.habits &&
                      item.habits.map((item: any, index: any) => {
                        // console.log(item.duration);
                        const task = AllHabits.find(
                          (task: any) => task.title === item.title,
                        );

                        return (
                          <TouchableOpacity
                            style={[
                              styles.indTaskCard,
                              {
                                backgroundColor: themeLightYellow,
                                position: 'relative',
                              },
                            ]}
                            onPress={() => {
                              navigation.navigate('ind-habit', {habit: task});
                            }}
                            key={index}>
                            <View style={styles.headingAndTime}>
                              <Text style={styles.TaskHeading}>
                                {item.title.slice(0, 10)}...
                              </Text>
                              <View style={styles.TaskTime}>
                                <Image
                                  source={{uri: item.icon}}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50,
                                    resizeMode: 'stretch',
                                    backgroundColor: themeYellow,
                                    // transform: [{translateX: -10}],
                                  }}
                                />
                              </View>
                            </View>
                            {/* //TODO Add the done mark */}
                            {/* <View style={{position:"absolute", top:-10, zIndex:100 }}>
                           <DoneIcon style={{width:50 , height:50}}  />
                           </View> */}
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>

                <View style={styles.stepDivider}>
                  <View style={styles.stepDividerLine}></View>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </ScrollView>
  );
};

// <View style={styles.firstStep}>
// <Text style={styles.timeText}>11:00 AM</Text>
// <View style={styles.stepCircle}></View>
// <View style={styles.stepContent}>
//   <View style={styles.indTaskCard}></View>
//   <View style={styles.indTaskCard}></View>
// </View>
// </View>
// <View style={styles.stepDivider}>
// <View style={styles.stepDividerLine}></View>
// </View>
// <View style={styles.secondStep}>
// <Text style={styles.timeText}>12:00 AM</Text>

// <View style={styles.stepCircle}></View>
// <View style={styles.stepContent}>
//   <View style={styles.indTaskCard}></View>
//   <View style={styles.indTaskCard}></View>
// </View>
// </View>
export default StepperComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',

    width: '100%',
    padding: 10,
    justifyContent: 'center',
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderWidth: 2.5,
    backgroundColor: themeBlack,
    borderColor: themeWhite,
  },
  firstStep: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    minHeight: 100,
    width: '95%',
    justifyContent: 'space-around',
  },
  secondStep: {
    zIndex: 5,
    flexDirection: 'row',
    width: '95%',
    height: 150,
    marginTop: height * 0.05,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stepDivider: {
    zIndex: 2,
    flexDirection: 'row',
    width: '80%',
    height: '100%',
    paddingHorizontal: '10%',

    position: 'absolute',
    justifyContent: 'flex-start',
  },
  stepDividerLine: {
    width: 2.5,
    marginLeft: '25.5%',

    backgroundColor: themeGrey,
  },
  stepContent: {
    width: '65%',
    gap: 10,

    flexDirection: 'column',
    justifyContent: 'center',
  },
  indTaskCard: {
    width: '100%',
    position: 'relative',
    borderRadius: 10,
    height: 80,
    padding: 10,
  },
  timeText: {
    fontSize: 12,
    color: themeLightWhite,
    fontFamily: 'Poppins-Medium',
  },
  headingAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // transform: [{translateY: -10}],
    zIndex: 5,
  },
  TaskTimeText: {
    fontSize: 10,
    color: themeBlack,
    fontFamily: 'Poppins-Medium',
    zIndex: 5,
  },
  TaskHeading: {
    fontSize: 15,
    color: themeBlack,
    fontFamily: 'Poppins-Bold',
  },
  TaskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  TaskDescription: {
    fontSize: 12,
    color: themeGrey,
    marginTop: 7.5,
    fontFamily: 'Poppins-Light',
  },
});
