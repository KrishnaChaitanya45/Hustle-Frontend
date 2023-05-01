import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CrossIcon from '../../../assets/icons/cross.svg';
import {useRoute} from '@react-navigation/native';
import colors from '../../utils/colors';
import CalanderIcon from '../../../assets/icons/plan-your-day.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import FromTo from '../../../assets/icons/from-to.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import WeekCalander from '../../components/eventCalander/WeekCalander';
import moment from 'moment';
import StarIcon from '../../../assets/icons/award.svg';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {
  addSubTasks,
  updateSingleSubTask,
} from '../../features/Tasks/TasksSlice';
import {TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {Timer, Countdown} from 'react-native-element-timer';
import {current} from '@reduxjs/toolkit';
const {width, height} = Dimensions.get('window');

const SubTask = ({navigation}) => {
  const router = useRoute();

  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);
  const [isEndTimePicker, setIsEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [percentageWorked, setPercentageWorked] = useState(0);
  const [title, setTitle] = useState(null);
  const [taskStatus, setTaskStatus] = useState('working');
  const [tasksWorking, setTasksWorking] = useState(0);
  const [startDate, setStartDate] = useState(moment());
  const [clicked, setClicked] = useState(null);
  const [subTasks, setSubTasks] = useState(null);
  const dispatch = useDispatch();
  const [currentWorkingTask, setCurrentWorkingTask] = useState(null);
  const counterRef = useRef(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const {task, createdBy} = router.params;
  const [tasksWorkedNow, setTasksWorkedNow] = useState(0);
  const [taskDuration, setTaskDuration] = useState(task.duration);

  const [taskProgress, setTaskProgress] = useState(task.progress);
  const [timer, setTimer] = useState(
    task.duration.hours * 3600 +
      task.duration.minutes * 60 +
      task.duration.seconds,
  );
  const initialTaskDuration =
    task.duration.hours * 3600 +
    task.duration.minutes * 60 +
    task.duration.seconds;
  // useEffect(() => {
  //   if (task.progress.length > 0) {
  //     setTaskProgress(taskProgress => taskProgress.push(task.progress));
  //   }
  // }, []);

  const startTimer = () => {
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
    setTimerInterval(
      setInterval(() => {
        if (timer > 0) {
          setTimer(timer => timer - 1);
        }
      }, 1000),
    );
    console.log('timer interval', timer);

    setTasksWorking(prev => prev + 1);
  };

  const stopTimer = () => {
    let taskExists = currentWorkingTask.find(task => task.id == currentTime);
    // console.log(taskExists);
    if (taskExists) {
      clearInterval(timerInterval);
      if (taskExists.status === 'started' || taskExists.status === 'working') {
        const endTime = moment();
        const durationWorkedSeconds = moment(endTime).diff(
          moment(taskExists.startTime),
          'seconds',
        );

        console.log('duration worked', durationWorkedSeconds);
        const durationInSeconds =
          taskDuration.hours * 3600 +
          taskDuration.minutes * 60 +
          taskDuration.seconds;
        let durationPending;
        if (taskStatus === 'completed') {
          durationPending = 0;
        } else {
          durationPending = durationInSeconds - durationWorkedSeconds;
        }
        console.log('duration pending', durationPending);
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
        setPercentageWorked(percentageWorkedUptoNow);
        if (percentageWorkedUptoNow >= 100) {
          setTaskStatus('completed');
        }
      }
    }
  };
  if (timer < 0) {
    setTaskStatus('completed');
    stopTimer();
    setTimer(0);
  }
  const backHandler = async () => {
    console.log(tasksWorking);
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
            `https://dear-diary-backend.cyclic.app/api/v1/tasks/${createdBy}/main-tasks/${task.belongsTo}/sub-tasks/${task._id}`,
            {
              progress: taskProgress,
              status: taskStatus,
              percentageWorked: percentageWorked,
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
    if (!currentWorkingTask || taskStatus === 'completed') {
      navigation.navigate('all-tasks', {
        name: 'user',
      });
    }
  };
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',

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
        <TouchableOpacity onPress={() => backHandler()}>
          <CrossIcon width={30} height={30} />
        </TouchableOpacity>
        <TouchableOpacity style={{width: 30, height: 30}} />
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
        <FromTo width={35} height={35} />
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
        <FromTo width={35} height={35} />
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
      <View
        style={{
          justifyContent: 'center',
          marginTop: '5%',
          alignItems: 'center',
          backgroundColor: 'black',
          borderRadius: 20,
          flexDirection: 'row',
          gap: 10,
          padding: 10,
        }}>
        <ClockIcon width={35} height={35} />
        {/* <Text
          style={{
            fontFamily: 'OpenSans-Medium',
            fontSize: 16,
            color: 'white',
          }}>
          {task.duration.hours + 'h ' + task.duration.minutes + 'm'}
        </Text> */}

        <Text>
          {taskStatus != 'completed'
            ? Math.floor(Math.floor(timer / 60) / 60) +
              ' hr ' +
              (Math.floor(timer / 60) % 60) +
              ' min ' +
              (timer % 60) +
              ' s'
            : 'Task Completed'}
        </Text>

        <Button onPress={() => startTimer()} title="play" />
        <Button onPress={() => stopTimer(task.duration)} title="pause" />
      </View>
      <View style={styles.progressContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.progressText}>Progress</Text>
          {/* <RightArrow width={35} height={35} /> */}
        </View>
        <View>
          {/* <View
            style={[
              styles.progress,
              {
                backgroundColor:
                  percentage > 0 ? colors.themeGrey : colors.themeRed,
              },
            ]}>
            <View
              style={[
                styles.progressFill,
                {
                  shadowColor: color,
                  width: `${percentage > 0 ? percentage : 0}%`,
                  backgroundColor: color,
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
              {percentage > 0 ? percentage : 0} %
            </Text>
          </View> */}
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleSubTask(task._id, task.duration)}>
        <Text>Play</Text>
      </TouchableOpacity>
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
        {taskProgress &&
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
          })}
      </ScrollView>
    </ScrollView>
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
    width: '100%',
    height: 50,
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
    fontSize: 28,
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
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: '15%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
