import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import DeleteIcon from '../../../assets/icons/delete.svg';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CrossIcon from '../../../assets/icons/cross.svg';
import {useRoute} from '@react-navigation/native';
import colors, {themeBlack, themeLightWhite} from '../../utils/colors';
import CalanderIcon from '../../../assets/icons/plan-your-day.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import FireIcon from '../../../assets/icons/fire.svg';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import WeekCalander from '../../components/eventCalander/WeekCalander';
import moment from 'moment';
import StarIcon from '../../../assets/icons/award.svg';
import Toast from 'react-native-toast-message';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

import {useSelector} from 'react-redux';
import {addSubTasks} from '../../features/Tasks/TasksSlice';
import {TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {Timer, Countdown} from 'react-native-element-timer';
import PopUpModal from '../../components/modal/Modal';
const {width, height} = Dimensions.get('window');
const IndividualMainTask = ({navigation}) => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);
  const [isEndTimePicker, setIsEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mainTaskProgress, setMainTaskProgress] = useState(false);
  const [taskProgress, setTaskProgress] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [clicked, setClicked] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [timer, setTimer] = useState(moment.duration(0));
  const [subTasks, setSubTasks] = useState(null);
  const dispatch = useDispatch();
  let fetchedSubTasks = [];
  fetchedSubTasks = useSelector(state => state.subtasks);

  if (startDate && endDate) {
    if (moment(startDate).isAfter(endDate)) {
      setStartDate(endDate);
      setEndDate(startDate);
    }
  }
  const router = useRoute();
  const {task, points} = router.params;
  if (points != undefined) setPointsModalOpen(true);
  const createdBy = task.createdBy;

  const showToast = (text1, text2, type) => {
    Toast.show({
      text1: text1,
      text2: text2,
      type: type,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const showStartTimePicker = () => {
    setIsStartTimePicker(true);
  };
  const showEndTimePicker = () => {
    setIsEndTimePicker(true);
  };

  const hideEndTimePicker = () => {
    setIsEndTimePicker(false);
  };

  const hideStartTimePicker = () => {
    setIsStartTimePicker(false);
  };

  const handleConfirm = time => {
    const fullTime = {
      hour:
        moment(time).hour() > 12
          ? moment(time).hour() - 12
          : moment(time).hour(),
      minute: moment(time).minutes(),
      seconds: moment(time).seconds(),
      toCalculate: time,
      fullhour: moment(time).hour(),
      ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
      displayTime: moment(time).format('hh:mm A'),
    };

    if (
      fullTime.fullhour >= task.startTime.fullhour &&
      fullTime.fullhour <= task.endTime.fullhour
    ) {
      console.log(
        '=== REACHED HERE - 1 ===',
        fullTime.fullhour,
        task.startTime.fullhour,
      );
      if (
        fullTime.fullhour === task.startTime.fullhour ||
        fullTime.fullhour === task.endTime.fullhour
      ) {
        console.log('=== REACHED HERE - 2 ===');
        if (fullTime.fullhour === task.startTime.fullhour) {
          if (fullTime.minute >= task.startTime.minute) {
            setStartTime(fullTime);
            hideStartTimePicker();
          } else {
            showToast(
              'Invalid Time',
              `Start time should be between main task's time`,
              'error',
            );
          }
        }
        if (fullTime.fullhour === task.endTime.fullhour)
          if (fullTime.minute <= task.endTime.minute) {
            console.log(
              '=== REACHED HERE - 3 ===',
              fullTime.minute,
              task.startTime.minute,
              task.endTime.minute,
            );
            setStartTime(fullTime);
            hideStartTimePicker();
          } else {
            showToast(
              'Invalid Time',
              `Start time should be between main task's time`,
              'error',
            );

            console.log('=== REACHED HERE - 4 ===');
          }
        setStartTime(fullTime);
        hideStartTimePicker();
      } else {
        console.log('=== REACHED HERE INSIDER- 5 ===');
        setStartTime(fullTime);
        hideStartTimePicker();
      }
    } else {
      showToast(
        'Invalid Time',
        `Start time should be between main task's time`,
        'error',
      );

      hideStartTimePicker();
    }
  };
  const createSubTask = async () => {
    if (!endDate) {
      showToast('Set End Date', `Please set the end date`, 'error');
    }
    if (!startDate) {
      showToast('Set Start Date', `Please set the start date`, 'error');
    }
    if (!endTime) {
      showToast('Set End Time', `Please set the end time`, 'error');
    }
    if (!startTime) {
      showToast('Set Start Time', `Please set the start time`, 'error');
    }

    if (!title) {
      showToast('Set Title', `Please set the title`, 'error');
    }
    if (title && startTime && endTime && startDate && endDate) {
      const subTask = {
        title: title,
        startTime: startTime,
        endTime: endTime,
        start: startDate,
        deadline: endDate,
        duration: duration,
        percentageWorked: 0,
      };
      try {
        const response = await axios.post(
          `http://192.168.1.16:5000/api/v1/tasks/${task.createdBy}/main-tasks/${task._id}/sub-tasks`,
          subTask,
        );
        console.log(response.data);
        setSubTasks([...subTask, response.data.task]);
        dispatch(addSubTasks(response.data.task));
        setMainTaskProgress(true);
      } catch (error) {
        console.log(error.message);
      }
      console.log(subTask);
      showToast('Sub Task Created', `Sub Task Created Successfully`, 'success');
      fetchSubTasks();
      setTimeout(() => {
        setIsModelVisible(false);
      }, 2000);
    }
  };
  const handleEndConfirm = time => {
    if (moment(time).add(1, 'hour').hour() > startTime.fullhour) {
      const fullTime = {
        hour:
          moment(time).hour() > 12
            ? moment(time).hour() - 12
            : moment(time).hour(),
        fullhour: moment(time).hour(),
        minute: moment(time).minutes(),
        seconds: moment(time).seconds(),
        toCalculate: time,
        ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
        displayTime: moment(time).format('hh:mm A'),
      };

      const durationInSeconds = moment(fullTime.toCalculate).diff(
        moment(startTime.toCalculate),
        'seconds',
      );

      const hours =
        Math.floor(Math.floor(durationInSeconds / 60) / 60) > 0
          ? Math.floor(Math.floor(durationInSeconds / 60) / 60)
          : 0;
      const minutes =
        Math.floor(Math.floor(durationInSeconds / 60) % 60) > 0
          ? Math.floor(Math.floor(durationInSeconds / 60) % 60)
          : 0;
      const seconds = durationInSeconds % 60;
      if (hours > 0) {
        setDuration({
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        });
      } else {
        setDuration({
          hours: 0,
          minutes: minutes,
          seconds: seconds,
        });
      }
      if (
        fullTime.fullhour >= task.startTime.fullhour &&
        fullTime.fullhour <= task.endTime.fullhour
      ) {
        if (
          fullTime.fullhour === task.startTime.fullhour ||
          fullTime.fullhour === task.endTime.fullhour
        ) {
          if (
            fullTime.minute >= task.startTime.minute ||
            fullTime.minute <= task.endTime.minute
          ) {
            console.log('=== REACHED HERE ===');
            if (startTime.fullhour === fullTime.fullhour) {
              console.log(startTime);
              if (startTime.minute < fullTime.minute) {
                console.log('Reached HERE');
                setEndTime(fullTime);
                showToast(
                  'Timer Set Successfully 🥳',
                  `Set the sub task for ${
                    hours > 0
                      ? hours +
                        '  hours  ' +
                        minutes +
                        ' minutes' +
                        seconds +
                        ' seconds'
                      : minutes + ' minutes' + seconds + ' seconds'
                  } every day..!`,
                  'success',
                );
                hideEndTimePicker();
              } else {
                showToast(
                  'Invalid Time',
                  `End time should be greater than the start time`,
                  'error',
                );
                hideEndTimePicker();
              }
            } else {
              setEndTime(fullTime);
              showToast(
                'Timer Set Successfully 🥳',
                `Set the sub task for ${
                  hours > 0
                    ? hours +
                      '  hours  ' +
                      minutes +
                      ' minutes' +
                      seconds +
                      ' seconds'
                    : minutes + ' minutes' + seconds + ' seconds'
                } every day..!`,
                'success',
              );
              hideEndTimePicker();
            }
          } else {
            showToast(
              'Invalid Time',
              `End time should be between main task's time`,
              'error',
            );
            hideEndTimePicker();
          }
        } else {
          setEndTime(fullTime);
          showToast(
            'Timer Set Successfully 🥳',
            `Set the sub task for ${
              hours > 0
                ? hours +
                  '  hours  ' +
                  minutes +
                  ' minutes' +
                  seconds +
                  ' seconds'
                : minutes + ' minutes' + seconds + ' seconds'
            } every day..!`,
            'success',
          );
          hideEndTimePicker();
        }
      } else {
        showToast(
          'Invalid Time',
          `End time should be between main task's time`,
          'error',
        );
        hideEndTimePicker();
      }
    } else {
      showToast('Error', `End time should be less than start time`, 'error');
    }
    hideEndTimePicker();
  };
  const fetchSubTasks = async () => {
    console.log('reached here-1');
    try {
      if (!fetchedSubTasks) {
        console.log('reached here-2');
        const url = `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${task.createdBy}/main-tasks/${task._id}/sub-tasks`;
        console.log(url);
        const response = await axios.get(url);
        console.log('requested..!');
        setSubTasks(response.data.subtasks);
        response.data.subtasks.map(task => {
          console.log(task.percentageWorked);
          setPercentage(prev => prev + task.percentageWorked);
        });
        dispatch(addSubTasks(response.data.subtasks));
      } else {
        setSubTasks(fetchedSubTasks);
      }
    } catch (error) {
      console.log('fetching tasks failed.>!');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSubTasks();

    setLoading(false);

    setCurrentTime(moment().format('hh:mm A'));
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            position: 'relative',
            backgroundColor: colors.themeBlack,
          }}>
          <View style={{zIndex: 5}}>
            <Toast />
          </View>
          <View
            style={[
              styles.infoContainer,
              {
                padding: 20,
              },
            ]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('all-tasks', {
                  name: 'user',
                  reload: true,
                  fetch: false,
                })
              }
              style={{
                borderRadius: 50,
                backgroundColor: '#000',

                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LeftArrow width={50} height={50} />
            </TouchableOpacity>
            <Text style={styles.taskTitle}>Main Task</Text>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                backgroundColor: '#000',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setPointsModalOpen(true);
              }}>
              <FireIcon width={50} height={50} />
              <Text style={styles.firePoints}>{task.points}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.taskDetails}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </View>
          <View style={styles.datesContainer}>
            <View
              style={[
                styles.date,
                {
                  shadowColor: colors.themeBlue,
                },
              ]}>
              <CalanderIcon width={30} height={30} />
              <Text style={styles.dateText}>
                {moment(task.start).format('DD MMM YYYY')}
              </Text>
            </View>

            <View
              style={[
                styles.date,
                {
                  shadowColor: colors.themeRed,
                },
              ]}>
              <CalanderIcon width={30} height={30} />
              <Text style={styles.dateText}>
                {moment(task.deadline).format('DD MMM YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.datesContainer}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1.5,
                  justifyContent: 'space-between',
                  padding: 10,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  elevation: 20,
                },
                {
                  shadowColor: colors.themeBlue,
                },
              ]}>
              <ClockIcon width={35} height={35} />
              <Text style={styles.dateText}>
                {task.startTime.displayTime} - {task.endTime.displayTime}
              </Text>
            </View>

            <View
              style={[
                styles.date,
                {
                  shadowColor: colors.themeRed,
                },
              ]}>
              <ClockIcon width={35} height={35} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Medium',
                  fontSize: 14,
                  color:
                    moment(task.deadline)
                      .add(1, 'day')
                      .diff(moment(), 'days') >= 0
                      ? 'white'
                      : colors.themeRed,
                }}>
                {moment(task.deadline).add(1, 'day').diff(moment(), 'days') >= 0
                  ? moment(task.deadline)
                      .add(1, 'day')
                      .diff(moment(), 'days') == 0
                    ? 'Today'
                    : moment(task.deadline)
                        .add(1, 'day')
                        .diff(moment(), 'days') + ' Days Left'
                  : 'Deadline Passed'}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.progressText}>Progress</Text>
              <RightArrow width={35} height={35} />
            </View>
            <View>
              <View
                style={[
                  styles.progress,
                  {
                    backgroundColor: '#000',
                  },
                ]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      shadowColor:
                        (percentage / subTasks) * 100 > 0
                          ? colors.themeGrey
                          : colors.themeRed,
                      width: `${
                        subTasks
                          ? percentage / subTasks.length > 100
                            ? 100
                            : percentage / subTasks.length
                          : 0
                      }%`,
                      backgroundColor: subTasks
                        ? percentage / subTasks.length > 0
                          ? percentage / subTasks.length > 30
                            ? percentage / subTasks.length > 50
                              ? percentage / subTasks.length > 70
                                ? colors.themeGreen
                                : colors.themeBlue
                              : colors.themeYellow
                            : colors.themeGrey
                          : colors.themeRed
                        : colors.themeRed,
                    },
                  ]}
                />
                <Text
                  style={{
                    textAlign: 'right',
                    marginRight: '5%',
                    marginTop: '2%',
                    fontFamily: 'MateSC-Regular',
                    fontSize: 18,
                  }}>
                  {subTasks && subTasks.length > 0
                    ? `${
                        percentage / subTasks.length > 0
                          ? Math.round(percentage / subTasks.length) > 100
                            ? 100
                            : Math.round(percentage / subTasks.length)
                          : 0
                      }`
                    : 0}{' '}
                  %
                </Text>
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.subTasksContainer}>
            {(subTasks && subTasks.length) > 0 ? (
              subTasks.map(fetchedTask => {
                let thisTask;

                if (fetchedTask.belongsTo == task._id) {
                  thisTask = fetchedTask;
                }

                let timingsContainer;
                const taskExists = taskProgress.find(task => task.id === id);
                if (taskExists) {
                  timingsContainer = true;
                }
                const toggleSubTask = (id, duration) => {
                  console.log(thisTask);
                  navigation.navigate('sub-task', {
                    task: thisTask,
                    createdBy,
                    deadline: task.deadline,
                  });
                };

                if (thisTask) {
                  const percentage =
                    thisTask.percentageWorked > 0
                      ? thisTask.percentageWorked
                      : 0.1;
                  let color;
                  console.log(thisTask.percentageWorked);
                  if (percentage * 100 > 0 && percentage * 100 < 10) {
                    color = colors.themeRed;
                  } else if (percentage * 100 > 10 && percentage * 100 < 30) {
                    color = colors.themeLightYellow;
                  } else if (percentage * 100 > 30 && percentage * 100 < 50) {
                    color = colors.themeYellow;
                  } else if (percentage * 100 > 50 && percentage * 100 < 70) {
                    color = colors.themeLightBlue;
                  } else if (percentage * 100 > 70 && percentage * 100 < 100) {
                    color = colors.themeBlue;
                  } else {
                    color = colors.themeLightGreen;
                  }
                  console.log(thisTask);
                  return (
                    <View
                      style={[
                        styles.subTasks,
                        {
                          borderWidth: 1,
                          borderColor: colors.themeGrey,
                          shadowColor: colors.themeRed,
                        },
                      ]}
                      key={Math.random().toString()}>
                      <View
                        style={{
                          flexDirection: 'row',
                          position: 'absolute',
                          width: `${thisTask.percentageWorked + 10}%`,
                          height: 150,
                          borderRadius: 20,
                          backgroundColor: color,
                        }}></View>
                      <View style={styles.subTasksRightContainer}>
                        <Text
                          style={[
                            styles.subTasksText,
                            {
                              color:
                                percentage * 100 > 50
                                  ? colors.themeBlack
                                  : colors.themeWhite,
                            },
                          ]}>
                          {thisTask.title}
                        </Text>
                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                          <ClockIcon width={30} height={30} />
                          <Text
                            style={{
                              fontFamily: 'OpenSans-Medium',
                              fontSize: 14,
                              color:
                                percentage * 100 > 50
                                  ? colors.themeBlack
                                  : `rgba(255,255,255, 0.75)`,
                            }}>
                            {thisTask.status != 'completed'
                              ? thisTask.progress &&
                                thisTask.progress.length > 0
                                ? thisTask.progress[
                                    thisTask.progress.length - 1
                                  ].timePending.hours >= 0
                                  ? (thisTask.progress[
                                      thisTask.progress.length - 1
                                    ].timePending.hours || 0) +
                                    ' hr ' +
                                    thisTask.progress[
                                      thisTask.progress.length - 1
                                    ].timePending.minutes +
                                    ' min ' +
                                    thisTask.progress[
                                      thisTask.progress.length - 1
                                    ].timePending.seconds +
                                    ' sec  Left'
                                  : thisTask.progress[
                                      thisTask.progress.length - 1
                                    ].timePending.minutes +
                                    ' min ' +
                                    thisTask.progress[
                                      thisTask.progress.length - 1
                                    ].timePending.seconds +
                                    ' sec  Left'
                                : thisTask.duration.hours >= 0
                                ? thisTask.duration.hours +
                                  ' hr ' +
                                  thisTask.duration.minutes +
                                  ' min ' +
                                  thisTask.duration.seconds +
                                  ' sec '
                                : thisTask.duration.minutes +
                                  ' min ' +
                                  thisTask.duration.seconds +
                                  ' sec  Left'
                              : 'Completed'}{' '}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginTop: 5,
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 10,
                          }}>
                          <StarIcon width={25} height={25} />
                          <Text
                            style={{
                              color:
                                percentage * 100 > 50
                                  ? colors.themeBlack
                                  : 'rgba(255,255,255,0.75)',
                            }}>
                            {thisTask.startTime
                              ? thisTask.startTime.displayTime
                              : moment(thisTask.startTime).format(
                                  'hh:mm A',
                                )}{' '}
                            -{' '}
                            {thisTask.endTime
                              ? thisTask.endTime.displayTime
                              : moment(thisTask.endTime).format('hh:mm A')}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          toggleSubTask(thisTask._id, thisTask.duration)
                        }>
                        <RightArrow width={35} height={35} />
                      </TouchableOpacity>
                    </View>

                    // </Swipeable>
                  );
                } else if (subTasks.length < 1) {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'OpenSans-Medium',
                          fontSize: 18,
                        }}>
                        No Sub Tasks
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'OpenSans-Medium',
                          fontSize: 18,
                        }}>
                        Fetching Sub Tasks..!
                      </Text>
                    </View>
                  );
                }
              })
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: themeLightWhite,
                    transform: [{translateY: -50}],

                    fontFamily: 'OpenSans-Medium',
                    fontSize: 18,
                  }}>
                  {Loading ? 'Fetching Tasks..!' : 'No Tasks Found'}
                </Text>
              </View>
            )}
          </ScrollView>
          <View style={{flex: 1, backgroundColor: 'black'}}>
            <Modal animationType="slide" transparent visible={isModelVisible}>
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.75)'}}>
                <View style={{zIndex: 5}}>
                  <Toast />
                </View>
                <View style={styles.model}>
                  <View
                    style={[
                      styles.infoContainer,
                      {
                        alignItems: 'center',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => setIsModelVisible(false)}
                      style={{
                        backgroundColor: 'black',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 7.5,
                        borderRadius: 100,
                      }}>
                      <CrossIcon width={30} height={30} />
                    </TouchableOpacity>
                    <Text style={styles.modelHeading}>Create Sub Task</Text>
                  </View>
                  <View style={styles.weekViewContainer}>
                    <WeekCalander
                      clicked={clicked}
                      setClicked={setClicked}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      startDate={startDate}
                      variant={{start: task.start, end: task.deadline}}
                      setStartDate={setStartDate}
                    />
                  </View>
                  <View style={styles.displayTimes}>
                    <View style={styles.startTimeContainer}>
                      <View
                        style={{
                          backgroundColor: 'black',
                          padding: 15,
                          borderRadius: 20,
                          gap: 10,
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <CalanderIcon width={25} height={25} />
                        <Text
                          style={{
                            color: colors.themeWhite,
                            fontSize: 14,

                            fontFamily: 'Poppins-Medium',
                          }}>
                          {startDate &&
                            `${moment(startDate).format('D MMM YYYY')}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                        }}>
                        <TouchableOpacity
                          title="Show Date Picker"
                          onPress={showStartTimePicker}
                          style={styles.timePickerContainer}>
                          <ClockIcon width={30} height={30} />
                          <Text
                            style={{
                              color: colors.themeWhite,
                              fontSize: 14,

                              fontFamily: 'Poppins-Medium',
                            }}>
                            {startTime ? startTime.displayTime : 'Start Time'}
                          </Text>

                          <DateTimePickerModal
                            isVisible={isStartTimePicker}
                            mode="time"
                            locale="en_GB"
                            date={new Date()}
                            onConfirm={handleConfirm}
                            onCancel={hideStartTimePicker}
                          />
                        </TouchableOpacity>
                      </View>
                      {/* <Text
                style={{
                  color: colors.themeBlue,
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {startDate
                  ? moment(startDate).format('D MMM YYYY')
                  : 'Provide a start date'}
              </Text> */}
                    </View>
                    <View style={styles.endTimeContainer}>
                      <View
                        style={{
                          backgroundColor: 'black',
                          padding: 15,
                          borderRadius: 20,
                          gap: 10,
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <CalanderIcon width={25} height={25} />
                        <Text
                          style={{
                            color: colors.themeWhite,
                            fontSize: 14,

                            fontFamily: 'Poppins-Medium',
                          }}>
                          {endDate
                            ? `${moment(endDate).format('D MMM YYYY')}`
                            : 'End date'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        title="Show Date Picker"
                        onPress={showEndTimePicker}
                        style={styles.timePickerContainer}>
                        <ClockIcon width={30} height={30} />
                        <Text
                          style={{
                            color: colors.themeWhite,
                            fontSize: 14,

                            fontFamily: 'Poppins-Medium',
                          }}>
                          {endTime ? endTime.displayTime : 'End time'}
                        </Text>

                        <DateTimePickerModal
                          isVisible={isEndTimePicker}
                          mode="time"
                          locale="en_GB"
                          date={new Date()}
                          onConfirm={handleEndConfirm}
                          onCancel={hideEndTimePicker}
                        />
                      </TouchableOpacity>
                      {/* <Text
                style={{
                  color: colors.themeYellow,
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {endDate
                  ? moment(endDate).format('D MMM YYYY')
                  : 'Provide a deadline'}
              </Text> */}
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      textColor={colors.themeWhite}
                      placeholder="Subtask Name"
                      underlineColorAndroid="transparent"
                      placeholderTextColor={colors.themeGrey}
                      onChangeText={text => setTitle(text)}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: '7.5%',
                      backgroundColor: 'black',
                      padding: 10,
                      alignSelf: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 20,
                      borderRadius: 20,
                    }}>
                    <ClockIcon width={30} height={30} />
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'OpenSans-Medium',
                        color: colors.themeWhite,
                        textAlign: 'center',
                      }}>
                      {duration
                        ? duration.hours
                          ? `${duration.hours}hr ${duration.minutes}min left`
                          : `${duration.minutes} min left`
                        : 'Duration'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      width: width - 60,
                      padding: 7.5,
                      borderRadius: 20,
                      backgroundColor: colors.themeBlack,
                    }}
                    onPress={createSubTask}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.themeWhite,
                        fontSize: 20,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Create Sub Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          {points && (
            <PopUpModal
              modalVisible={pointsModalOpen}
              setModalVisible={setPointsModalOpen}
              points={points}
            />
          )}
        </ScrollView>
      </GestureHandlerRootView>
      {moment(task.deadline).add(1, 'day').diff(moment(), 'days') >= 0 && (
        <View style={{width: width, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.plus}
            onPress={() => {
              console.log('clicked');
              setIsModelVisible(true);
            }}>
            <PlusIcon width={40} height={40} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default IndividualMainTask;

const styles = StyleSheet.create({
  infoText: {
    fontSize: 24,
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    color: colors.themePurple,
  },
  infoContainer: {
    width: '90%',
    marginTop: '5%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskDetails: {
    width: '100%',
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    gap: 10,
  },
  taskTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: colors.themeWhite,
  },
  taskDescription: {
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    color: colors.themeGrey,
  },
  datesContainer: {
    width: '100%',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    gap: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    elevation: 20,
  },
  dateText: {
    color: colors.themeWhite,
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
  },
  progressContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: '5%',
  },
  progressText: {
    color: colors.themeWhite,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  progress: {
    width: '100%',
    height: 25,
    elevation: 20,
    borderRadius: 25,
    marginTop: '5%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  subTasksContainer: {
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
    minHeight: height / 3,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: '15%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  firePoints: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.themeGrey,
    color: colors.themeYellow,
    borderRadius: 20,
    paddingHorizontal: 5,

    paddingTop: 2.25,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  plusContainer: {
    width: width,
    position: 'absolute',
    top: 0,
    alignSelf: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
    justifyContent: 'center',
  },
  plus: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: (height / 100) * 10,
    zIndex: 10,

    borderRadius: 30,
    opacity: 0.75,
    backgroundColor: colors.themeGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTasks: {
    width: '90%',
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderRadius: 20,
    padding: 10,
  },
  subTasksRightContainer: {
    flexDirection: 'column',
    width: '70%',
  },
  subTasksText: {
    width: '100%',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  model: {
    width: width,
    height: height / 1.25,
    backgroundColor: colors.themeGrey,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    padding: 20,
    alignItems: 'center',
    borderTopRightRadius: 40,
  },
  modelHeading: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: 'white',

    paddingRight: '20%',
  },
  weekViewContainer: {
    width: '100%',
    marginTop: 10,
  },
  displayTimes: {
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  startTimeContainer: {
    width: '45%',
    borderRadius: 20,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endTimeContainer: {
    width: '45%',
    borderRadius: 20,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    width: '100%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    width: '100%',
    marginTop: '7.5%',
  },
  input: {
    backgroundColor: 'black',
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
