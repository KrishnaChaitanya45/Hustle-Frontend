import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useState} from 'react';
import colors from '../../utils/colors';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CalanderIcon from '../../../assets/icons/plan-your-day.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import moment from 'moment';
import CrossIcon from '../../../assets/icons/cross.svg';
import WeekCalander from '../../components/eventCalander/WeekCalander';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {updateSingleTask} from '../../features/Tasks/TasksSlice';
const {width, height} = Dimensions.get('window');
const EditTask = ({navigation}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {task} = route.params;
  const [clicked, setClicked] = useState(null);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const categories = [
    {label: '🏢 Work', value: 'work', color: '#E4F2FB'},
    {label: '💻 Productivity', value: 'productivity', color: '#B9F3E4'},
    {label: '🎮 Gaming', value: 'gaming', color: '#C0DEFF'},
    {label: '🌞 Routine', value: 'routine', color: '#FFACAC'},
    {label: '📕 Study', value: 'study', color: '#FBCBB9'},
    {label: '😉 Random', value: 'random', color: '#FD8A8A'},
  ];

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

  const [Category, setCategory] = useState(task.category);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setEndDate(null);
    setCategory(null);
    setClicked(null);
    setStartDate(null);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);
  const [isEndTimePicker, setIsEndTimePicker] = useState(false);
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
    setStartTime(moment(time).unix());
    hideStartTimePicker();
  };

  const handleEndConfirm = time => {
    setEndTime(moment(time).unix());
    hideEndTimePicker();
  };

  const [endDate, setEndDate] = useState(task.deadline);
  const [startDate, setStartDate] = useState(moment());
  if (startDate && endDate) {
    if (moment(startDate).isAfter(endDate)) {
      setStartDate(endDate);
      setEndDate(startDate);
    }
  }
  const [taskName, setTaskName] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const handleSubmit = async () => {
    if (!taskName && taskName.trim().length < 5) {
      showToast('Invalid Task name', 'Please enter valid task name', 'error');
      return;
    } else if (!Category) {
      showToast('Invalid Category', 'Please select a category', 'error');
    } else if (!description && description.trim().length < 5) {
      showToast(
        'Invalid Description',
        'Please enter valid description',
        'error',
      );
    } else if (!startDate) {
      showToast('Invalid Start Date', 'Please select a start date', 'error');
    } else if (!endDate) {
      showToast('Invalid End Date', 'Please select a end date', 'error');
    } else if (!startTime) {
      showToast('Invalid Start Time', 'Please select a start time', 'error');
    } else if (!endTime) {
      showToast('Invalid End Time', 'Please select a end time', 'error');
    } else if (moment(startDate).isAfter(endDate)) {
      showToast('Invalid Date', 'Start date cannot be after end date', 'error');
    } else if (moment(startTime).isAfter(endTime)) {
      showToast('Invalid Time', 'Start time cannot be after end time', 'error');
    } else {
      let body = {
        title: taskName,
        description: description,
        category: Category,
        start: moment(startDate),
        deadline: moment(endDate),
        startTime: startTime,
        endTime: endTime,
      };
      console.log(body);
      try {
        const user = await AsyncStorage.getItem('user');
        const userId = JSON.parse(user)._id;

        try {
          console.log('request sent');
          const response = await axios.patch(
            `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${userId}/main-tasks/${task._id}`,
            body,
          );
          dispatch(updateSingleTask(response.data.task));
          if (response.status === 200) {
            showToast(
              'Task Updated 🚀',
              'Your task has been updated successfully 🥳, redirecting to tasks screen..!',
              'success',
            );
            setTimeout(() => {
              navigation.navigate('all-tasks');
            }, 3000);
          }
        } catch (error) {
          showToast('Error', `${error.message}`, 'error');
        }
      } catch (error) {
        showToast(
          'Server Error',
          'We are working to fix this error sorry..! 😢',
          'error',
        );
      }
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <View style={{zIndex: 5}}>
          <Toast />
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('user', {
                name: 'user',
              })
            }>
            <CrossIcon width={30} height={30} />
          </TouchableOpacity>
          <Text style={styles.infoText}>Edit Task</Text>
          <TouchableOpacity />
        </View>
        <View style={styles.weekViewContainer}>
          <WeekCalander
            clicked={clicked}
            setClicked={setClicked}
            endDate={endDate}
            setEndDate={setEndDate}
            startDate={startDate}
            setStartDate={setStartDate}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={{
              color: colors.themeWhite,
              fontSize: 20,
              fontFamily: 'Poppins-Medium',
            }}>
            Task Details
          </Text>

          <TextInput
            placeholder="Task Name"
            value={taskName}
            onChangeText={text => setTaskName(text)}
            textColor="white"
            placeholderTextColor="rgba(255,255,255,0.75)"
            style={{
              backgroundColor: 'black',
              width: '100%',
              borderRadius: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              color: colors.themeWhite,
            }}
          />

          <TextInput
            placeholder="Task Description"
            textColor="white"
            value={description}
            onChangeText={text => setDescription(text)}
            placeholderTextColor="rgba(255,255,255,0.75)"
            style={{
              backgroundColor: 'black',
              width: '100%',
              borderRadius: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              color: colors.themeWhite,
            }}
            multiline={true}
            numberOfLines={3}
          />
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
                  {startDate && `${moment(startDate).format('D MMM YYYY')}`}
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
                    {startTime
                      ? startTime.displayTime
                      : moment(Date.now()).format('hh:mm A')}
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
          <View style={styles.categoryContainer}>
            <Text
              style={{
                color: colors.themeWhite,
                fontSize: 20,
                fontFamily: 'Poppins-Medium',
              }}>
              Category
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                height: 50,
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
                gap: 10,
              }}
              horizontal>
              {categories.map((category, index) => {
                return (
                  <TouchableOpacity
                    key={category.value}
                    onPress={() => {
                      if (!Category) {
                        setCategory(category.value);
                      }
                    }}>
                    <Text
                      style={{
                        padding: 10,
                        fontFamily: 'Poppins-Medium',
                        fontSize: 14,
                        borderRadius: 20,
                        minWidth: 80,
                        maxHeight: 40,
                        transform: [
                          {scale: Category === category.value ? 1.05 : 1},
                        ],
                        opacity: Category === category.value ? 1 : 0.75,
                        backgroundColor: category.color,
                        color: colors.themeBlack,
                      }}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {/* <TouchableOpacity key={category.value}>
                <Text
                  style={{
                    padding: 10,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    borderRadius: 20,
                    width: 100,
                    backgroundColor: category.color,
                    color: colors.themeBlack,
                  }}>
                  {category.label}
                </Text>
              </TouchableOpacity> */}
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            width: width - 60,
            padding: 7.5,
            borderRadius: 20,
            backgroundColor: colors.themeBlue,
          }}
          onPress={handleSubmit}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.themeBlack,
              fontSize: 20,
              fontFamily: 'Poppins-Medium',
            }}>
            Update Task
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: colors.themeBlack,
    paddingLeft: 15,
    paddingTop: 10,
    paddingRight: 15,
  },
  infoText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: colors.themePurple,
  },
  infoContainer: {
    width: width - 20,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    left: '60%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },

  weekViewContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 25,
    width: width - (width / 100) * 10,
    gap: 10,
  },
  displayTimes: {
    flexDirection: 'row',
    marginTop: 10,
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
  categoryContainer: {
    marginTop: 10,
  },
});
