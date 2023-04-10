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
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

import {useSelector} from 'react-redux';
import {addSubTasks} from '../../features/Tasks/TasksSlice';
import {TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {Timer, Countdown} from 'react-native-element-timer';
const {width, height} = Dimensions.get('window');
const IndividualMainTask = ({navigation}) => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);
  const [isEndTimePicker, setIsEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [taskProgress, setTaskProgress] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [clicked, setClicked] = useState(null);
  const [timer, setTimer] = useState(moment.duration(0));
  const [subTasks, setSubTasks] = useState(null);
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const fetchedSubTasks = useSelector(state => state.subtasks);
  if (startDate && endDate) {
    if (moment(startDate).isAfter(endDate)) {
      setStartDate(endDate);
      setEndDate(startDate);
    }
  }
  const router = useRoute();
  const {task} = router.params;
  console.log(task);
  const createdBy = task.createdBy;
  const percentage = Math.floor(
    (task.completedTasks.length / task.subtasks.length) * 100,
  );
  let color;
  if (percentage < 50) {
    color = colors.themeRed;
  } else if (percentage < 80) {
    color = colors.themeYellow;
  } else {
    color = colors.themeGreen;
  }
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
      minute: moment(time).minute(),
      fullhour: moment(time).hour(),
      ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
      displayTime: moment(time).format('hh:mm A'),
    };
    setStartTime(fullTime);
    hideStartTimePicker();
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
      };
      try {
        const response = await axios.post(
          `https://dear-diary-backend.cyclic.app/api/v1/tasks/${task.createdBy}/main-tasks/${task._id}/sub-tasks`,
          subTask,
        );
        console.log(response.data);
        setSubTasks([...subTask, response.data.task]);
        dispatch(addSubTasks(response.data.task));
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
    if (moment(time).hour() > startTime.fullhour) {
      const fullTime = {
        hour:
          moment(time).hour() > 12
            ? moment(time).hour() - 12
            : moment(time).hour(),
        fullhour: moment(time).hour(),
        minute: moment(time).minute(),
        ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
        displayTime: moment(time).format('hh:mm A'),
      };

      const hours = fullTime.fullhour - startTime.fullhour;
      const minutes = fullTime.minute - startTime.minute;
      if (hours > 0) {
        setDuration({
          hours: hours,
          minutes: Math.ceil(minutes / 60),
        });
      } else {
        setDuration({
          hours: null,
          minutes: minutes,
        });
      }
      setEndTime(fullTime);
      showToast(
        'Timer Set Successfully 🥳',
        `Set the sub task for ${
          hours > 0
            ? hours + '  hours  ' + Math.ceil(minutes / 60) + ' minutes'
            : minutes + ' minutes'
        } every day..!`,
        'success',
      );
    } else {
      showToast('Error', `End time should be less than start time`, 'error');
    }
    hideEndTimePicker();
  };
  const fetchSubTasks = async () => {
    try {
      if (!fetchedSubTasks) {
        const response = await axios.get(
          `https://dear-diary-backend.cyclic.app/api/v1/tasks/${task.createdBy}/main-tasks/${task._id}/sub-tasks`,
        );
        setSubTasks(response.data.subtasks);
        dispatch(addSubTasks(response.data.subtasks));
      } else {
        setSubTasks(fetchedSubTasks);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSubTasks();
    console.log(subTasks);
    setCurrentTime(moment().format('hh:mm A'));
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('all-tasks', {
                name: 'user',
              })
            }>
            <CrossIcon width={30} height={30} />
          </TouchableOpacity>
          <TouchableOpacity style={{width: 30, height: 30}} />
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
        <View
          style={{
            justifyContent: 'center',
            marginTop: '5%',
            alignItems: 'center',
            backgroundColor:
              moment(task.deadline).diff(moment(), 'days') > 0
                ? 'black'
                : colors.themeGrey,
            borderRadius: 20,
            flexDirection: 'row',
            gap: 10,
            padding: 10,
          }}>
          <ClockIcon width={35} height={35} />
          <Text
            style={{
              fontFamily: 'OpenSans-Medium',
              fontSize: 16,
              color:
                moment(task.deadline).add(1, 'day').diff(moment(), 'days') > 0
                  ? 'white'
                  : colors.themeRed,
            }}>
            {moment(task.deadline).add(1, 'day').diff(moment(), 'days') > 0
              ? moment(task.deadline).add(1, 'day').diff(moment(), 'days') +
                ' Days Left'
              : 'Deadline Passed'}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.progressText}>Progress</Text>
            <RightArrow width={35} height={35} />
          </View>
          <View>
            <View
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
            </View>
          </View>
        </View>

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
        </View>

        <ScrollView contentContainerStyle={styles.subTasksContainer}>
          {subTasks &&
            subTasks.map(task => {
              console.log(task);
              let timingsContainer;
              const taskExists = taskProgress.find(task => task.id === id);
              if (taskExists) {
                timingsContainer = true;
              }
              const toggleSubTask = (id, duration) => {
                navigation.navigate('sub-task', {
                  task,
                  createdBy,
                });
                // if (taskExists) {
                //   if (
                //     taskExists.status === 'started' ||
                //     taskExists.status === 'working'
                //   ) {
                //     timerRef.current.pause();

                //     const endTime = moment().format('hh:mm A');
                //     const durationWorkedSeconds = moment(endTime, 'hh:mm A').diff(
                //       moment(taskExists.startTime),
                //       'seconds',
                //     );
                //     const durationInSeconds =
                //       duration.hours * 3600 + duration.minutes * 60;
                //     const durationPending =
                //       durationInSeconds - durationWorkedSeconds;
                //     const updatedTask = taskProgress.map(task => {
                //       if (task.id === id) {
                //         return {
                //           ...task,
                //           endTime: endTime,
                //           status: durationPending > 0 ? 'working' : 'completed',
                //           timeWorked: {
                //             hours:
                //               Math.floor(durationWorkedSeconds / 3600) > 0
                //                 ? Math.floor(durationWorkedSeconds / 3600)
                //                 : 0,
                //             minutes:
                //               Math.floor(durationWorkedSeconds / 60) > 0
                //                 ? Math.floor(durationWorkedSeconds / 60)
                //                 : 0,
                //             seconds: durationWorkedSeconds,
                //           },
                //           timePending: {
                //             hours:
                //               Math.floor(durationPending / 3600) > 0
                //                 ? Math.floor(durationPending / 3600)
                //                 : 0,
                //             minutes:
                //               Math.floor(durationPending / 60) > 0
                //                 ? Math.floor(durationPending / 60)
                //                 : 0,
                //             seconds: durationPending,
                //           },
                //         };
                //       }
                //       return task;
                //     });
                //     setTaskProgress(updatedTask);
                //   } else {
                //     const startTime = moment();
                //     timerRef.current.start();
                //     taskProgress.push({
                //       id: id,
                //       startTime: startTime,
                //       endTime: null,
                //       duration: duration,
                //       status: 'started',
                //     });
                //   }
                // }
              };
              console.log(task.duration.hours);

              return (
                // <Swipeable
                //   renderRightActions={() => {
                //     return (
                //       <TouchableOpacity
                //         style={{
                //           padding: 20,
                //           alignItems: 'center',
                //           justifyContent: 'center',
                //         }}
                //         onPress={() =>
                //           navigation.navigate('edit-task', {task})
                //         }>
                //         <DeleteIcon width={45} height={45} />
                //       </TouchableOpacity>
                //     );
                //   }}
                //   key={task._id}>
                <View style={styles.subTasks}>
                  <View style={styles.subTasksRightContainer}>
                    <Text style={styles.subTasksText}>{task.title}</Text>
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
                          color: `rgba(255,255,255, 0.75)`,
                        }}>
                        {task.duration.hours
                          ? task.duration.hours +
                            ' Hours ' +
                            task.duration.minutes +
                            ' minutes'
                          : task.duration.minutes &&
                            task.duration.minutes + ' minutes'}{' '}
                      </Text>
                    </View>
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
                        {task.startTime
                          ? task.startTime.displayTime
                          : moment(task.startTime).format('hh:mm A')}{' '}
                        -{' '}
                        {task.endTime
                          ? task.endTime.displayTime
                          : moment(task.endTime).format('hh:mm A')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSubTask(task._id, task.duration)}>
                    <RightArrow width={35} height={35} />
                  </TouchableOpacity>
                </View>
                // </Swipeable>
              );
            })}
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
      </ScrollView>
    </GestureHandlerRootView>
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
