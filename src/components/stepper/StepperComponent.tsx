import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import React from 'react';
import {
  themeBlack,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightWhite,
  themeLightYellow,
  themeWhite,
} from '../../utils/colors';
import moment from 'moment';
//@ts-ignore
import ClockIcon from '../../../assets/icons/clocktask.svg';
const {width, height} = Dimensions.get('window');
const StepperComponent = () => {
  const data = [
    {
      id: 1,

      time: '10:00 AM',
      task: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
    {
      id: 2,

      time: '11:00 AM',
      task: [
        {
          title: 'Step 2',
          description: 'Step 2 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
    {
      id: 2,

      time: '11:00 AM',
      task: [
        {
          title: 'Step 2',
          description: 'Step 2 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
    {
      id: 2,

      time: '11:00 AM',
      task: [
        {
          title: 'Step 2',
          description: 'Step 2 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
    {
      id: 2,

      time: '11:00 AM',
      task: [
        {
          title: 'Step 2',
          description: 'Step 2 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
    {
      id: 2,

      time: '11:00 AM',
      task: [
        {
          title: 'Step 2',
          description: 'Step 2 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
        {
          title: 'Step 1',
          description: 'Step 1 description',
          date: '2021-06-01',
          duration: '1 hour',
          isCompleted: true,
          isCurrent: false,
          isUpcoming: false,
        },
      ],
    },
  ];
  const linesHeight = data.length * (height * 0.1);
  const cardsHeight = data.map(item => item.task.length * 70 + 10);
  const totalContainerHeight =
    linesHeight + cardsHeight.reduce((a, b) => a + b, 0);
  console.log(totalContainerHeight);
  const startTime = moment('10:00 AM', 'hh:mm a');
  const endTime = moment('11:00 PM', 'hh:mm a');
  const diffInHours = endTime.diff(startTime, 'hours');

  let hours = [];
  for (let i = 0; i <= diffInHours; i++) {
    hours.push(startTime.clone().add(i, 'hours').format('HH:mm A'));
  }
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
          data.map((item, index) => {
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
                      height: item.task.length * 70 + 10,
                    },
                  ]}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={styles.stepCircle}></View>
                  <View style={styles.stepContent}>
                    {item.task &&
                      item.task.map((item, index) => {
                        return (
                          <View
                            style={[
                              styles.indTaskCard,
                              {
                                backgroundColor: generateRandomColor(),
                              },
                            ]}
                            key={index}>
                            <View style={styles.headingAndTime}>
                              <Text style={styles.TaskHeading}>
                                {item.title}
                              </Text>
                              <View style={styles.TaskTime}>
                                <ClockIcon width={20} height={20} />
                                <Text style={styles.TaskTimeText}>
                                  {item.duration}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.TaskDescription}>
                              {item.description}
                            </Text>
                          </View>
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
    position: 'relative',

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

    borderRadius: 10,
    height: 70,
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
  },
  TaskTimeText: {
    fontSize: 10,
    color: themeBlack,
    fontFamily: 'Poppins-Medium',
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
