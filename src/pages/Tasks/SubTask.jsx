import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Animated,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import CrossIcon from '../../../assets/icons/cross.svg';
import {useRoute} from '@react-navigation/native';
import colors, {
  themeGrey,
  themeLightGreen,
  themeLightYellow,
  themeYellow,
} from '../../utils/colors';
import FireIcon from '../../../assets/icons/fire.svg';
import BackgroundService from 'react-native-background-actions';
import CalanderIcon from '../../../assets/icons/plan-your-day.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import TaskCompletedCelebration from '../../../assets/videos/task-completed.json';
import PlayIcon from '../../../assets/icons/play.svg';
import Lottie from 'lottie-react-native';
import {Linking} from 'react-native';
import PauseIcon from '../../../assets/icons/pause.svg';
import moment from 'moment';
import StarIcon from '../../../assets/icons/award.svg';
import Toast from 'react-native-toast-message';

import {
  addSubTasks,
  updateSingleSubTask,
} from '../../features/Tasks/TasksSlice';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('window');
const SubTask = ({navigation}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const router = useRoute();

  const [currentTime, setCurrentTime] = useState(null);
  const [taskStatus, setTaskStatus] = useState('working');
  const [tasksWorking, setTasksWorking] = useState(0);
  const [firstTimeCompleted, setFirstTimeCompleted] = useState(false);
  const dispatch = useDispatch();
  const [currentWorkingTask, setCurrentWorkingTask] = useState(null);
  const counterRef = useRef(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const {task, createdBy, deadline} = router.params;
  console.log(
    `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${createdBy}/main-tasks/${task.belongsTo}/sub-tasks/${task._id}`,
  );

  const [tasksWorkedNow, setTasksWorkedNow] = useState(0);
  const [percentageWorked, setPercentageWorked] = useState(
    task.percentageWorked,
  );
  const [isCompleted, setIsCompleted] = useState(
    percentageWorked >= 100 ? true : false,
  );
  const [taskDuration, setTaskDuration] = useState(task.duration);

  const [taskProgress, setTaskProgress] = useState(task.progress);
  const [timer, setTimer] = useState(
    (task.progress.length > 0
      ? task.progress[task.progress.length - 1].timePending.hours
      : task.duration.hours) *
      3600 +
      (task.progress.length > 0
        ? task.progress[task.progress.length - 1].timePending.minutes
        : task.duration.minutes) *
        60 +
      (task.progress.length > 0
        ? task.progress[task.progress.length - 1].timePending.seconds
        : task.duration.seconds),
  );
  const [taskStarted, setTaskStarted] = useState(false);
  const initialTaskDuration =
    task.duration.hours * 3600 +
    task.duration.minutes * 60 +
    task.duration.seconds;
  // useEffect(() => {
  //   if (task.progress.length > 0) {
  //     setTaskProgress(taskProgress => taskProgress.push(task.progress));
  //   }
  // }, []);

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const notificationTimer = async taskDataArguments => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      setTimerInterval(
        setInterval(async () => {
          if (timer > 0) {
            setTimer(timer => timer - 1);
            // console.log('=== TIMER ===', timer);

            await sleep(delay);
          }
        }, 1000),
      );
    });
  };
  useEffect(() => {
    (async () =>
      await BackgroundService.updateNotification({
        taskDesc:
          'Task In Progress..!' +
          Math.floor(Math.floor((timer - 1) / 60) / 60) +
          ' hr ' +
          (Math.floor((timer - 1) / 60) % 60) +
          ' min ' +
          ((timer - 1) % 60) +
          ' s Left..!',
      }))();
  }, [timer]);
  const options = {
    taskName: 'Dear Diary',
    taskTitle: task.title,
    taskDesc: 'Task In Progress..!',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'DearDiary://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 0,
    },
  };
  async function requestPostNotification() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification',
          message: 'Please allow to show notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  const startBackgroundService = async () => {
    requestPostNotification();
    try {
      console.log('Starting background service');
      await BackgroundService.start(notificationTimer, options);
      await BackgroundService.updateNotification({
        taskDesc: 'Task In Progress..!',
      });
    } catch (e) {
      console.log('Error', e);
    }
  };
  const stopBackgroundService = async () => {
    try {
      console.log('Stopping background service');
      await BackgroundService.stop();
    } catch (e) {
      console.log('Error', e);
    }
  };

  Linking.addEventListener('url', () => {});
  const startTimer = () => {
    startBackgroundService();
    console.log('=== Timer started ===');
    if (!currentWorkingTask && taskStatus !== 'completed') {
      const startTime = moment();
      setTaskProgress(taskProgress => [
        ...taskProgress,
        {
          id: startTime,
          startTime: startTime,
          endTime: null,
          duration: taskDuration,
          status: 'started',
        },
      ]);
      setCurrentTime(startTime);
      if (taskProgress.length > 0) {
        setCurrentWorkingTask([
          ...taskProgress,
          {
            id: startTime,
            startTime: startTime,
            endTime: null,
            duration: taskDuration,
            status: 'started',
          },
        ]);
      }
      setCurrentWorkingTask([
        {
          id: startTime,
          startTime: startTime,
          endTime: null,
          duration: taskDuration,
          status: 'started',
        },
      ]);
      // setTimerInterval(
      //   setInterval(() => {
      //     if (timer > 0) {
      //       setTimer(timer => timer - 1);
      //     }
      //   }, 1000),
      // );
      console.log('timer interval', timer);

      setTasksWorking(prev => prev + 1);
    }
  };

  const stopTimer = () => {
    stopBackgroundService();
    console.log('=== Timer stopped ===');
    if (currentWorkingTask && taskStatus !== 'completed') {
      let taskExists = currentWorkingTask.find(task => task.id == currentTime);
      // console.log(taskExists);
      if (taskExists) {
        clearInterval(timerInterval);
        if (
          taskExists.status === 'started' ||
          taskExists.status === 'working'
        ) {
          const endTime = moment();
          const durationWorkedSeconds = moment(endTime).diff(
            moment(taskExists.startTime),
            'seconds',
          );

          console.log('duration worked', durationWorkedSeconds);
          console.log(taskProgress);
          const durationInSeconds =
            (taskProgress[taskProgress.length - 2]
              ? taskProgress[taskProgress.length - 2].timePending.hours * 3600
              : task.duration.hours * 3600) +
            (taskProgress[taskProgress.length - 2]
              ? taskProgress[taskProgress.length - 2].timePending.minutes * 60
              : task.duration.minutes * 60) +
            (taskProgress[taskProgress.length - 2]
              ? taskProgress[taskProgress.length - 2].timePending.seconds
              : task.duration.seconds);
          console.log('==== duration in seconds ====', durationInSeconds);
          let durationPending;
          if (taskStatus === 'completed') {
            durationPending = 0;
          } else {
            durationPending = durationInSeconds - durationWorkedSeconds;
          }
          console.log('=== duration pending ===', durationPending);
          setTaskDuration({
            hours:
              Math.floor(Math.floor(durationPending / 60) / 60) > 0
                ? Math.floor(Math.floor(durationPending / 60) / 60)
                : 0,
            minutes:
              Math.floor(Math.floor(durationPending / 60) % 60) > 0
                ? Math.floor(Math.floor(durationPending / 60) % 60)
                : 0,
            seconds: durationPending % 60,
          });
          setTimer(durationPending);
          const updatedTask = taskProgress.map(task => {
            if (task.id == currentTime) {
              console.log(task);
              return {
                ...task,
                endTime: endTime,
                status: durationPending > 0 ? 'working' : 'completed',
                timeWorked: {
                  hours:
                    Math.floor(Math.floor(durationWorkedSeconds / 60) / 60) > 0
                      ? Math.floor(Math.floor(durationWorkedSeconds / 60) / 60)
                      : 0,
                  minutes:
                    Math.floor(Math.floor(durationWorkedSeconds / 60) % 60) > 0
                      ? Math.floor(Math.floor(durationWorkedSeconds / 60) % 60)
                      : 0,
                  seconds: durationWorkedSeconds % 60,
                },
                timePending: {
                  hours:
                    Math.floor(Math.floor(durationPending / 60) / 60) > 0
                      ? Math.floor(Math.floor(durationPending / 60) / 60)
                      : 0,
                  minutes:
                    Math.floor(Math.floor(durationPending / 60) % 60) > 0
                      ? Math.floor(Math.floor(durationPending / 60) % 60)
                      : 0,
                  seconds: durationPending % 60,
                },
              };
            }
            return task;
          });
          setTaskProgress(updatedTask);
          setCurrentWorkingTask(null);
          setTasksWorking(prev => prev - 1);
          setTasksWorkedNow(prev => prev + 1);
          console.log(updatedTask);
          const taskDurationUpdated = updatedTask.find(
            task => task.id == currentTime,
          ).timePending;

          const taskDurationUpdatedInSeconds =
            updatedTask[updatedTask.length - 1].timePending.hours * 3600 +
            updatedTask[updatedTask.length - 1].timePending.minutes * 60 +
            updatedTask[updatedTask.length - 1].timePending.seconds;
          const percentageWorkedUptoNow =
            100 -
            Math.floor(
              (taskDurationUpdatedInSeconds * 100) / initialTaskDuration,
            );
          console.log('==== PERCENTAGE WORKED ====', percentageWorkedUptoNow);
          setPercentageWorked(percentageWorkedUptoNow);
          if (percentageWorkedUptoNow >= 100) {
            console.log('==== REACHED HERE WHERE I WANTED ===');
            setTaskStatus('completed');
            setTimer(0);
            setFirstTimeCompleted(true);
            // backHandler();
          }
        }
      }
    }
  };

  const backHandler = async () => {
    console.log('==== BACK HANDLED ====');
    console.log(task.percentageWorked);

    if (task.completedAt) {
      return navigation.goBack();
    }
    if (taskProgress.length > 0 && taskStatus !== 'completed') {
      console.log('reached here - 1');
      if (currentWorkingTask) {
        console.log('reached here - 2');
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Stopping The Timer..!',
          text2:
            'Stopping the timer and updating the task progress to our servers..! ',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });
        stopTimer();
      }
      if (tasksWorkedNow > 0 && tasksWorking === 0) {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Updating Task..!',
          text2:
            'Please wait while we update your task progress to our servers..! ',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });
        try {
          const {data, status} = await axios.patch(
            `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${createdBy}/main-tasks/${task.belongsTo}/sub-tasks/${task._id}`,
            {
              progress: taskProgress,
              status: taskStatus,
              percentageWorked: percentageWorked,
              points: task.points,
              startTime: task.startTime.displayTime,
              endTime: task.endTime.displayTime,
              duration: task.duration,
              startDate: task.start,
              endDate: task.deadline,
            },
          );
          console.log(data);
          dispatch(updateSingleSubTask(data.task));

          if (status === 200) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'Task Updated',
              text2:
                'Your task has been updated successfully, redirecting to all tasks',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 30,
            });
            setTimeout(() => {
              navigation.navigate('all-tasks', {
                name: 'user',
                points: data.task.points - task.points,
              });
            }, 4000);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Task Updating Failed',
            text2:
              'Your task updating has been failed, redirecting to all tasks',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
          });
          console.log(error);
          setTimeout(() => {
            navigation.navigate('all-tasks', {
              name: 'user',
            });
          }, 4000);
        }
      }
    }
    if (!currentWorkingTask && firstTimeCompleted) {
      console.log('=== TRYING TO UPDATE TASK ===');
      console.log("=== TASK'S PERCENTAGE WORKED ===", percentageWorked);
      console.log('=== TASKS WORKED NOW ===', taskStatus);
      console.log('=== TASKS PROGRESS ===', {
        progress: taskProgress,
        status: taskStatus,
        percentageWorked: percentageWorked,
        points: task.points,
        startTime: task.startTime.displayTime,
        endTime: task.endTime.displayTime,
        duration: task.duration,
        startDate: task.start,
        endDate: task.deadline,
      });
      try {
        const {data, status} = await axios.patch(
          `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${createdBy}/main-tasks/${task.belongsTo}/sub-tasks/${task._id}`,
          {
            progress: taskProgress,
            status: taskStatus,
            percentageWorked: percentageWorked,
            points: task.points,
            startTime: task.startTime.displayTime,
            endTime: task.endTime.displayTime,
            duration: task.duration,
            startDate: task.start,
            endDate: task.deadline,
          },
        );
        console.log(data);
        if (task.points < data.task.points) {
          console.log('=== TASK POINTS ===', data.task.points);
        }
        dispatch(updateSingleSubTask(data.task));

        if (status === 200) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Task Updated',
            text2:
              'Your task has been updated successfully, redirecting to all tasks',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
          });
          setTimeout(() => {
            navigation.navigate('all-tasks', {
              name: 'user',
              points: data.task.points - task.points,
              reload: true,
            });
          }, 4000);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Task Updating Failed',
          text2: 'Your task updating has been failed, redirecting to all tasks',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });
        console.log(error);
        // setTimeout(() => {
        //   navigation.goBack();
        // }, 4000);
      }
    } else {
      navigation.goBack();
    }
  };
  useEffect(() => {
    // console.log(timer);
    if (!isCompleted) {
      if (timer <= 0) {
        setTaskStatus('completed');
        setTimeout(() => {
          setTaskStarted(!taskStarted);
          setIsCompleted(true);
          setPercentageWorked(100);
          stopTimer();
          Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Timer Stopped..!',
            text2:
              'Your task has been completed, updating the task progress..!',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
          });
          setTimer(0);
          // backHandler();
          console.log(
            '=== PERCENTAGE AFTER TIMER WORKED ===',
            percentageWorked,
          );
        }, 3000);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Task Completed..!',
          text2: 'Your task has been completed, updating the task progress..!',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });
      }
    }
  }, [timer]);
  let timingsContainer;
  const toggleSubTask = (id, duration) => {
    counterRef.current.start();
  };
  //   const percentage = Math.floor(
  //     (task.completedTasks.length / task.subtasks.length) * 100,
  //   );
  //   let color;
  //   if (percentage < 50) {
  //     color = colors.themeRed;
  //   } else if (percentage < 80) {
  //     color = colors.themeYellow;
  //   } else {
  //     color = colors.themeGreen;
  //   }
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',

          backgroundColor: colors.themeBlack,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{zIndex: 25}}>
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
            onPress={() => backHandler()}
            style={{
              backgroundColor: '#000',
            }}>
            <CrossIcon width={30} height={30} />
          </TouchableOpacity>
          <Text style={styles.taskTitle}>Sub Task</Text>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: '#000',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FireIcon width={50} height={50} />
            <Text style={styles.firePoints}>{task.points}</Text>
          </View>

          {/* <TouchableOpacity style={{width: 30, height: 30}} /> */}
        </View>
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>{task.title}</Text>
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
              styles.date,
              {
                shadowColor: colors.themeBlue,
              },
            ]}>
            <ClockIcon width={30} height={30} />
            <Text style={styles.dateText}>{task.startTime.displayTime}</Text>
          </View>

          <View
            style={[
              styles.date,
              {
                shadowColor: colors.themeRed,
              },
            ]}>
            <ClockIcon width={30} height={30} />
            <Text style={styles.dateText}>{task.endTime.displayTime}</Text>
          </View>
        </View>
        <View style={styles.datesContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: (width * 1) / 2 - 10,
              justifyContent: 'space-between',
              padding: 10,
              backgroundColor: 'black',
              borderRadius: 10,
              elevation: 20,
            }}>
            <ClockIcon width={25} height={30} />
            <Text style={{fontSize: 14, fontFamily: 'Poppins-Medium'}}>
              {!isCompleted
                ? Math.floor(Math.floor(timer / 60) / 60) +
                  ' hr ' +
                  (Math.floor(timer / 60) % 60) +
                  ' min ' +
                  (timer % 60) +
                  ' s'
                : 'Task Completed'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: (width * 0.8) / 2 - 10,
              justifyContent: 'space-between',
              padding: 7.5,
              backgroundColor: 'black',
              borderRadius: 10,
              borderWidth: 2.5,
              borderColor: isCompleted ? colors.themeGreen : themeLightYellow,
              elevation: 20,
            }}>
            <Checkbox
              value={isCompleted}
              onValueChange={async newValue => {
                setIsCompleted(newValue);
                if (newValue) {
                  Toast.show({
                    type: 'info',
                    position: 'top',
                    text1: 'Task Updating..! 🚀',
                    text2:
                      'Updating your progress to our servers..! 🚀, please wait..! ⏳',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 30,
                  });
                  try {
                    const url = `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${createdBy}/main-tasks/${task.belongsTo}/sub-tasks/${task._id}`;

                    console.log('=== BODY ===', {
                      progress: taskProgress,
                      status: 'completed',
                      percentageWorked: 100,
                      points: task.points,
                      progress: taskProgress,
                      startTime: task.startTime.displayTime,
                      endTime: task.endTime.displayTime,
                      duration: task.duration,
                      startDate: task.start,
                      endDate: task.deadline,
                    });
                    const {data, status} = await axios.patch(url, {
                      progress: taskProgress,
                      status: 'completed',
                      percentageWorked: 100,
                      points: task.points,
                      progress: taskProgress,
                      startTime: task.startTime.displayTime,
                      endTime: task.endTime.displayTime,
                      duration: task.duration,
                      startDate: task.start,
                      endDate: task.deadline,
                    });

                    console.log('== RESPONSE DATA ==', data);
                    dispatch(updateSingleSubTask(data.task));

                    if (status === 200) {
                      Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: 'Task Updated',
                        text2:
                          'Your task has been updated successfully, redirecting to all tasks',
                        visibilityTime: 4000,
                        autoHide: true,
                        topOffset: 30,
                      });
                      setTimeout(() => {
                        navigation.navigate('all-tasks', {
                          name: 'user',
                          reload: true,
                          points: data.task.points - task.points,
                          fetch: false,
                        });
                      }, 4000);
                    }
                  } catch (error) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      text1: 'Task Updating Failed',
                      text2:
                        'Your task updating has been failed, redirecting to all tasks',
                      visibilityTime: 4000,
                      autoHide: true,
                      topOffset: 30,
                    });
                    console.log(error);
                    setTimeout(() => {
                      navigation.navigate('all-tasks', {
                        name: 'user',
                      });
                    }, 4000);
                  }
                }
              }}
              tintColors={{true: themeLightGreen, false: themeLightYellow}}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
                color: isCompleted ? colors.themeGreen : themeLightYellow,
              }}>
              Completed
            </Text>
          </View>
          {/* <Text
          style={{
            fontFamily: 'OpenSans-Medium',
            fontSize: 16,
            color: 'white',
          }}>
          {task.duration.hours + 'h ' + task.duration.minutes + 'm'}
        </Text> */}
        </View>
        <View style={styles.progressContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.progressText}>Progress</Text>
            {/* <RightArrow width={35} height={35} /> */}
          </View>
        </View>

        {/* 
      <View
        style={[
          styles.plusContainer,
          {
            bottom: 60,
          },
        ]}>
        <TouchableOpacity
          style={styles.plus}
          onPress={() => {
            console.log('clicked');
            setIsModelVisible(true);
          }}>
          <PlusIcon width={40} height={40} />
        </TouchableOpacity>
      </View> */}

        <ScrollView contentContainerStyle={styles.subTasksContainer}>
          {taskProgress && taskProgress.length > 0 ? (
            taskProgress.map(task => {
              return (
                <View style={styles.subTasks} key={task.id}>
                  <View style={styles.subTasksRightContainer}>
                    <Text style={styles.subTasksText}>
                      {task.timeWorked
                        ? task.timeWorked.hours +
                          ' hr ' +
                          task.timeWorked.minutes +
                          ' min ' +
                          task.timeWorked.seconds +
                          ' s '
                        : initialTaskDuration - timer}
                    </Text>
                    {/* <View
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
                        color: `rgba(255,255,255, 0.75)`,
                      }}>
                      {task.duration.hours
                        ? task.duration.hours +
                          ' Hours ' +
                          task.duration.minutes +
                          ' minutes'
                        : task.duration.minutes + ' minutes'}{' '}
                    </Text>
                  </View> */}
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}>
                      <StarIcon width={25} height={25} />
                      <Text>
                        {moment(task.startTime).format('hh:mm:ss A')} -{' '}
                        {task.endTime
                          ? moment(task.endTime).format('hh:mm:ss A')
                          : 'Task In Progress'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSubTask(task._id, task.duration)}>
                    <RightArrow width={35} height={35} />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.subTasks}>
              <Text
                style={[
                  styles.subTasksText,
                  {
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                    // transform: [{translateY: -height * 0.1}],
                  },
                ]}>
                No Progress
              </Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      {!isCompleted && taskStarted && (
        <View
          style={{
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 5,
            height: height,

            width: width,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 28,
            }}>
            {taskStatus != 'completed'
              ? Math.floor(Math.floor(timer / 60) / 60) +
                ' hr ' +
                (Math.floor(timer / 60) % 60) +
                ' min ' +
                (timer % 60) +
                ' s'
              : '🚀 Task Completed 🚀'}
          </Text>
          {taskStatus == 'completed' && (
            <Lottie
              source={TaskCompletedCelebration}
              autoPlay
              loop
              style={{
                width: width,
                position: 'absolute',
                height: height,
              }}
            />
          )}
        </View>
      )}
      {!isCompleted &&
        moment(deadline).add(1, 'day').diff(moment(), 'days') >= 0 && (
          <TouchableOpacity
            style={{
              paddingTop: 10,
              // position: 'absolute',
              // justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              zIndex: 10,
              // flex: 1,
              paddingBottom: 10,
              paddingLeft: !taskStarted ? 12.5 : 10,
              paddingRight: !taskStarted ? 12.5 : 10,
              backgroundColor: themeGrey,
              borderRadius: 50,
              position: 'absolute',
              top: height * 0.8,
              left: width * 0.5 - 30,
              right: width * 0.5 - 30,
              zIndex: 10,
            }}
            onPress={() => {
              if (taskStarted) {
                // fadeOut();
                stopTimer();
                setTaskStarted(!taskStarted);
                // stopBackgroundService();
              } else {
                // fadeIn();
                startTimer();
                setTaskStarted(!taskStarted);
                // startBackgroundService();
              }
            }}>
            {!taskStarted ? (
              <PlayIcon width={40} height={40} />
            ) : (
              <PauseIcon width={40} height={40} />
            )}
          </TouchableOpacity>
        )}
    </>
  );
};

export default SubTask;
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
    width: '95%',
    padding: 10,
    gap: 20,
    marginLeft: 20,
    marginRight: 20,
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
    minHeight: height / 2.5,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: '15%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  plusContainer: {
    width: width,
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
    justifyContent: 'center',
  },
  plus: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.themeGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTasks: {
    width: '90%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.themeBlack,
    borderRadius: 20,
    padding: 10,
  },
  subTasksRightContainer: {
    flexDirection: 'column',
  },
  subTasksText: {
    color: colors.themeWhite,
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
