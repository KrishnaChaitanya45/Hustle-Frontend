import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Modal,
  Linking,
  Dimensions,
  Image,
  Button,
} from 'react-native';
import RegretIcon from '../../../assets/icons/cry.svg';
import {TextInput} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import LottiePlayer from 'lottie-react-native';
import CrossIcon from '../../../assets/icons/cross.svg';
import colors, {
  themeBlack,
  themeBlue,
  themeGreen,
  themeGrey,
  themeLightBlue,
  themeLightWhite,
  themeLightYellow,
  themePurple,
  themeRed,
  themeWhite,
  themeYellow,
} from '../../utils/colors';
import BackgroundService from 'react-native-background-actions';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import CalendarIcon from '../../../assets/icons/calendar-black.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ClockIcon from '../../../assets/icons/clock.svg';
import PlayIcon from '../../../assets/icons/play.svg';
import Toast from 'react-native-toast-message';
import PlusIcon from '../../../assets/icons/plus.svg';
import Cycling from '../../../assets/icons/bike-riding.svg';
import Jogging from '../../../assets/icons/jogging.svg';
import Studying from '../../../assets/icons/book-lovers.svg';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import axios from 'axios';
import LoadingAnimation from '../../../assets/videos/animation_lm0fqigv.json';
import {useDispatch, useSelector} from 'react-redux';
import DonutChart from '../../components/charts/DonutChart';
import CalanderChart from '../../components/charts/CalanderChart';
import {launchImageLibrary} from 'react-native-image-picker';
import {addWaffleChart} from '../../features/Tasks/TasksSlice';
const {width, height} = Dimensions.get('screen');
import data from './data';
const Habits = ({navigation}: any) => {
  const [isModelVisible, setIsModelVisible] = React.useState(false);
  const [iconSelected, setIconSelected] = React.useState(0);
  const [isStartTimePicker, setIsStartTimePicker] = useState(false);
  const [isEndTimePicker, setIsEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [image, setImage] = useState(null);
  const [duration, setDuration] = useState(null);
  const [timer, setTimer] = useState(null);
  const user = useSelector((state: any) => state.user);
  const [percentageCompleted, setPercentageCompleted] = useState<
    {
      id: any;
      percentage: number;
    }[]
  >([{id: 0, percentage: 0}]);
  const [fetchedHabitsData, setFetchedHabitsData] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const habitIconHandler = () => {};
  const habitsData: {
    id: number;
    icon: any;
    title: string;
    description: string;
  }[] = [
    {
      id: 0,
      icon: Cycling,
      title: 'Cycling',
      description: 'Going out for a ride',
    },
    {
      id: 1,
      icon: Jogging,
      title: 'Jogging',
      description: 'Going out for a run',
    },
    {
      id: 2,
      icon: Studying,
      title: 'Studying',
      description: 'Studying for an hour',
    },
  ];
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
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
  const [title, setTitle] = React.useState('');
  const [timerInterval, setTimerInterval] = React.useState(null);
  const [isHabitPageOpen, setIsHabitPageOpen] = React.useState(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const [description, setDescription] = React.useState('');
  const [defaultIcon, setDefaultIcon] = useState(undefined);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [datesData, setDatesData] = useState([
    {
      id: 'any',
      data: data,
    },
  ]);
  const [isHabitInProgress, setIsHabitInProgress] = React.useState(false);
  const [habitProgress, setHabitProgress] = React.useState<
    {
      id: any;
      startTime: any;
      endTime: any;
      duration: any;
      status: string;
      timePending: any;
    }[]
  >([]);
  const [weeksSelected, setWeeksSelected] = React.useState([]);
  const fetchHabits = async () => {
    setHabitsLoading(true);
    try {
      const {data} = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/habits/${user.user._id}`,
      );
      setFetchedHabitsData(data.habits);
      setHabitsLoading(false);
    } catch (error) {
      showToast(
        'Fetching habits failed 😢',
        "Its from out end...! We'll fix our servers",
        'error',
      );
    }
  };
  React.useEffect(() => {
    fetchedHabitsData &&
      fetchedHabitsData.forEach(habitSelected => {
        setLoadingChart(true);
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
            setLoadingChart(false);
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
  }, [fetchedHabitsData]);
  React.useEffect(() => {
    fetchHabits();
  }, [isModelVisible, habitProgress]);
  React.useEffect(() => {
    setTitle(
      habitsData.find(item => item.id === iconSelected)
        ? //@ts-ignore
          habitsData.find(item => item.id === iconSelected).title
        : '',
    );
    setDescription(
      //@ts-ignore
      habitsData.find(item => item.id === iconSelected)
        ? //@ts-ignore
          habitsData.find(item => item.id === iconSelected)?.description
        : '',
    );
  }, [iconSelected]);
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
      calculate: moment(time).toISOString(),
      fullhour: moment(time).hour(),
      ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
      displayTime: moment(time).format('hh:mm A'),
    };

    setStartTime(fullTime);
    hideStartTimePicker();
  };
  const handleEndConfirm = time => {
    const fullTime = {
      hour:
        moment(time).hour() > 12
          ? moment(time).hour() - 12
          : moment(time).hour(),
      minute: moment(time).minutes(),
      seconds: moment(time).seconds(),
      calculate: moment(time).toISOString(),
      toCalculate: time,
      fullhour: moment(time).hour(),
      ampm: moment(time).hour() > 12 ? 'PM' : 'AM',
      displayTime: moment(time).format('hh:mm A'),
    };
    if (fullTime.toCalculate < startTime.toCalculate) {
      showToast('Error', 'End time should be greater than start time', 'error');
    } else {
      setEndTime(fullTime);

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
    }
    hideEndTimePicker();
  };

  const weeksData: {id: number; day: string; shortForm: string}[] = [
    {
      id: 0,
      day: 'Monday',
      shortForm: 'M',
    },
    {
      id: 1,
      day: 'Tuesday',
      shortForm: 'T',
    },
    {
      id: 2,
      day: 'Wednesday',
      shortForm: 'W',
    },
    {
      id: 3,
      day: 'Thursday',
      shortForm: 'T',
    },
    {
      id: 4,
      day: 'Friday',
      shortForm: 'F',
    },
    {
      id: 5,
      day: 'Saturday',
      shortForm: 'S',
    },
    {
      id: 6,
      day: 'Sunday',
      shortForm: 'S',
    },
  ];
  const submitHandler = async () => {
    try {
      const body = new FormData();
      body.append('title', title);
      body.append('description', description);
      if (image) {
        const profileImage = {
          uri: image.uri,
          type: image.type,
          name: `${title}-Habit.jpg`,
        };
        body.append('image', profileImage);
        console.log('=== IMAGE ===', profileImage);
      } else if (defaultIcon != undefined) {
        body.append('imageFromBody', defaultIcon);
      }
      const startTimeObj = {
        fullhour: startTime.fullhour,
        minutes: startTime.minute,
        seconds: startTime.seconds,
        hour: startTime.hour,
        calculate: startTime.calculate,
        ampm: startTime.ampm,
        displayTime: startTime.displayTime,
      };
      console.log(startTimeObj.calculate);
      body.append('startTime', JSON.stringify(startTimeObj));

      const endTimeObj = {
        fullhour: endTime.fullhour,
        minutes: endTime.minute,
        seconds: endTime.seconds,
        calculate: endTime.calculate,
        hour: endTime.hour,
        ampm: endTime.ampm,
        displayTime: endTime.displayTime,
      };
      console.log(endTimeObj.calculate);
      body.append('endTime', JSON.stringify(endTimeObj));
      body.append('duration', JSON.stringify(duration));
      body.append('weeksSelected', weeksSelected);
      body.append('createdBy', user.user._id);

      try {
        console.log('REQUEST SENT');
        const response = await axios.post(
          `http://192.168.1.16:5000/api/v1/user/habits/${user.user._id}`,
          body,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('RESPONSE RECEIVED');
        if (response.status === 201) {
          showToast(
            'Habit Created Successfully..!🥳',
            'Going in a right way..!',
            'success',
          );
          setTimeout(() => {
            setIsModelVisible(false);
          }, 3000);
        } else {
          throw new Error('Habit Creation Failed..!😢');
        }
      } catch (error) {
        showToast(
          'Habit Creation Failed..!😢',
          'We are working on it, will fix it soon..!',
          'error',
        );
      }
    } catch (error) {
      console.log('REQUEST FAILED', error);
      showToast(
        'Habit Creation Failed..!😢',
        'We are working on it, will fix it soon..!',
        'error',
      );
    }
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const notificationTimer = async taskDataArguments => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      console.log('=== REACHED HERE ==');
      setTimerInterval(
        //@ts-ignore
        setInterval(async () => {
          //@ts-ignore
          if (timer > 0) {
            setTimer(timer => timer - 1);
            // console.log('=== TIMER ===', timer);
            await sleep(delay);
          }
        }, 1000),
      );
    });
  };
  const stopTimer = () => {
    stopBackgroundService();

    setIsHabitInProgress(false);
    clearInterval(timerInterval);
    console.log('=== TIMER STOPPED ===');
    const endTime = moment();
    const durationWorkedSeconds = moment(endTime).diff(
      moment(habitProgress[habitProgress.length - 1].startTime),
      'seconds',
    );

    console.log('duration worked', durationWorkedSeconds);
    console.log('=== HABIT PROGRESS ===', habitProgress);
    const durationInSeconds =
      (habitProgress[habitProgress.length - 2]
        ? habitProgress[habitProgress.length - 2].timePending.hours * 3600
        : isHabitPageOpen.duration.hours * 3600) +
      (habitProgress[habitProgress.length - 2]
        ? habitProgress[habitProgress.length - 2].timePending.minutes * 60
        : isHabitPageOpen.duration.minutes * 60) +
      (habitProgress[habitProgress.length - 2]
        ? habitProgress[habitProgress.length - 2].timePending.seconds
        : isHabitPageOpen.duration.seconds);
    console.log('==== duration in seconds ====', durationInSeconds);
    let durationPending;
    if (habitProgress[habitProgress.length - 1].status === 'completed') {
      durationPending = 0;
    } else {
      durationPending = durationInSeconds - durationWorkedSeconds;
    }
    console.log('=== duration pending ===', durationPending);

    setTimer(durationPending);
    const updatedTask = habitProgress.map(task => {
      if (task.id == habitProgress[habitProgress.length - 1].id) {
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
    setHabitProgress(updatedTask);
    console.log(updatedTask);

    const taskDurationUpdatedInSeconds =
      updatedTask[updatedTask.length - 1].timePending.hours * 3600 +
      updatedTask[updatedTask.length - 1].timePending.minutes * 60 +
      updatedTask[updatedTask.length - 1].timePending.seconds;
    const percentageWorkedUptoNow =
      100 -
      Math.floor(
        (taskDurationUpdatedInSeconds * 100) /
          (isHabitPageOpen.duration.hours * 3600 +
            isHabitPageOpen.duration.minutes * 60 +
            isHabitPageOpen.duration.seconds),
      );
    console.log('==== PERCENTAGE WORKED ====', percentageWorkedUptoNow);

    let prevProg = percentageCompleted.find(
      _ => _.id == habitProgress[habitProgress.length - 1].habitId,
    );
    if (Boolean(prevProg)) {
      let anotherObj = prevProg;
      anotherObj.percentage =
        percentageWorkedUptoNow > 100 ? 100 : percentageWorkedUptoNow;
      setPercentageCompleted(prev => [
        ...prev.filter(
          _ => _.id != habitProgress[habitProgress.length - 1].habitId,
        ),
        anotherObj,
      ]);
    } else {
      setPercentageCompleted(prev => [
        ...prev,
        {
          id: habitProgress[habitProgress.length - 1].habitId,
          percentage:
            percentageWorkedUptoNow > 100 ? 100 : percentageWorkedUptoNow,
        },
      ]);
    }

    // const durationInSeconds =
    //   (habitProgress[habitProgress.length - 1]
    //     ? habitProgress[habitProgress.length - 1].timePending.hours * 3600
    //     : duration.hours * 3600) +
    //   (habitProgress[habitProgress.length - 1]
    //     ? habitProgress[habitProgress.length - 1].timePending.minutes * 60
    //     : task.duration.minutes * 60) +
    //   (habitProgress[habitProgress.length - 1]
    //     ? habitProgress[habitProgress.length - 1].timePending.seconds
    //     : task.duration.seconds);
  };
  console.log('PERCENTAGE WORKED', percentageCompleted);
  useEffect(() => {
    (async () =>
      await BackgroundService.updateNotification({
        taskDesc:
          'Grinding..!' +
          Math.floor(Math.floor((timer - 1) / 60) / 60) +
          ' hr ' +
          (Math.floor((timer - 1) / 60) % 60) +
          ' min ' +
          ((timer - 1) % 60) +
          ' s Left..!',
      }))();
    console.log('TIMER', timer);
    if (timer <= 0) {
      (async () => {
        stopBackgroundService();
        await BackgroundService.removeAllListeners();
        await BackgroundService.stop();
        await BackgroundService.updateNotification({
          taskDesc: 'Completed..!',
        });
        stopTimer();
        setIsHabitInProgress(false);
      })();
    }
  }, [timer]);
  const options = {
    taskName: 'Dear Diary',
    taskTitle: isHabitPageOpen ? isHabitPageOpen.title : 'Habit',
    taskDesc: 'Grinding..!',
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
    try {
      requestPostNotification();
      console.log('==== Starting background service ===');
      await BackgroundService.start(notificationTimer, options);
      await BackgroundService.updateNotification({
        taskDesc: 'Task In Progress..!',
      });
    } catch (e) {
      console.log('Error', e);
    }
  };
  const startTimer = (args: any) => {
    startBackgroundService();
    console.log('=== Timer started ===');

    const startTime = moment();
    setHabitProgress(taskProgress => [
      // @ts-ignore
      ...taskProgress,
      // @ts-ignore
      {
        id: startTime,
        habitId: args.id,
        startTime: startTime,
        endTime: null,
        duration: args.duration,
        timePending: duration,
        percentageWorked: 0,
        status: 'started',
      },
    ]);
  };
  const pickImage = async () => {
    setDefaultIcon(undefined);
    setIconSelected(4);
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    if (file) {
      setImage(file);
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
  // console.log(percentageCompleted);
  Linking.addEventListener('url', () => {});
  const backHandler = async () => {
    console.log('=== Back button pressed ===');
    console.log(habitProgress);
    if (habitProgress.length > 0) {
      const habitId = habitProgress[habitProgress.length - 1].habitId;
      const percentageWorked = percentageCompleted.find(
        item => item.id === habitId,
      )?.percentage;
      console.log(percentageWorked);
      let status;
      if (percentageWorked >= 100) {
        status = 'done';
      } else {
        status = 'pending';
      }
      const date = moment().toDate();
      const body = {
        userId: user.user._id,
        startTime: {
          hour:
            moment(habitProgress[habitProgress.length - 1].startTime).hour() >
            12
              ? moment(
                  habitProgress[habitProgress.length - 1].startTime,
                ).hour() - 12
              : moment(
                  habitProgress[habitProgress.length - 1].startTime,
                ).hour(),
          fullhour: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).hour(),
          minute: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).minutes(),
          seconds: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).seconds(),
          toCalculate: habitProgress[habitProgress.length - 1].startTime,
          ampm:
            moment(habitProgress[habitProgress.length - 1].startTime).hour() >
            12
              ? 'PM'
              : 'AM',
          displayTime: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).format('hh:mm A'),
        },
        endTime: {
          hour:
            moment(habitProgress[habitProgress.length - 1].startTime).hour() >
            12
              ? moment(
                  habitProgress[habitProgress.length - 1].startTime,
                ).hour() - 12
              : moment(
                  habitProgress[habitProgress.length - 1].startTime,
                ).hour(),
          fullhour: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).hour(),
          minute: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).minutes(),
          seconds: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).seconds(),
          toCalculate: habitProgress[habitProgress.length - 1].startTime,
          ampm:
            moment(habitProgress[habitProgress.length - 1].startTime).hour() >
            12
              ? 'PM'
              : 'AM',
          displayTime: moment(
            habitProgress[habitProgress.length - 1].startTime,
          ).format('hh:mm A'),
        },
        percentage: percentageWorked,
        status,
        date,
      };
      console.log('API REQUEST SENT');
      const response = await axios.patch(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/habits/${habitId}`,
        body,
      );
      console.log(response);
      if (response.status == 200) {
        showToast('Hurrah..!🎉🎉🥳🥳', 'Habit Updated Successfully', 'success');
        setIsHabitPageOpen(null);
        // setDatesData([{id: 'any', data: data}]);
      } else {
        showToast('Sorry..!☹️', 'Failed to update the habit..', 'error');
        setIsHabitPageOpen(null);
        // setDatesData([{id: 'any', data: data}]);
      }
    } else {
      await stopBackgroundService();
      setIsHabitPageOpen(null);
      // setDatesData([{id: 'any', data: data}]);
    }
  };
  console.log('=== DATES DATA ===', datesData);
  return (
    <>
      {!isHabitInProgress ? (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('user', {
                  name: 'user',
                })
              }
              style={styles.crossIcon}>
              <CrossIcon width={30} height={30} />
            </TouchableOpacity>
            <Text style={styles.infoText}>Habits</Text>
            <TouchableOpacity style={{width: 30, height: 30}} />
          </View>

          <TouchableOpacity
            style={styles.plusIcon}
            onPress={() => {
              setIsModelVisible(true);
            }}>
            <PlusIcon width={30} height={30} />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={[
              styles.habitsDisplayContainer,
              {
                justifyContent:
                  !habitsLoading &&
                  fetchedHabitsData &&
                  fetchedHabitsData.length > 0
                    ? 'flex-start'
                    : 'center',
              },
            ]}
            showsVerticalScrollIndicator={false}>
            {!habitsLoading &&
            fetchedHabitsData &&
            fetchedHabitsData.length > 0 ? (
              fetchedHabitsData.map(_ => {
                const percentage = _.dates.find(i => {
                  return (
                    moment(i.date).format('DD-MM-YYYY') ==
                    moment().format('DD-MM-YYYY')
                  );
                });

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsHabitPageOpen(_);
                      setLoadingChart(true);
                      if (_.dates.length > 0) {
                        let thisTask;
                        if (datesData.find(i => i.id == _._id)) {
                          thisTask = datesData.find(i => i.id == _._id).data;
                        } else {
                          setDatesData(datesData => [
                            ...datesData,
                            {id: _._id, data: JSON.parse(JSON.stringify(data))},
                          ]);
                          thisTask = JSON.parse(JSON.stringify(data));
                        }
                        _.dates.map(i => {
                          const month = moment(i.date).month();
                          let week = moment(i.date).week();
                          function weekOfMonth(m) {
                            return (
                              moment(m).week() -
                              moment(m).startOf('month').week() +
                              1
                            );
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
                          thisTask[month].progress[Math.floor(date / 7)][
                            date % 7
                          ] = i.percentage;
                          console.log('== DATA TO BE SET ==', thisTask);
                          datesData.find(i => i.id == _._id)
                            ? (datesData.find(i => i.id == _._id).data =
                                thisTask)
                            : setDatesData(prev => [
                                ...prev,
                                {id: _._id, data: thisTask},
                              ]);
                          setLoadingChart(false);
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
                        if (!datesData.find(i => i.id == _._id)) {
                          setDatesData(prev => [
                            ...prev,
                            {
                              id: _._id,
                              data: JSON.parse(JSON.stringify(data)),
                            },
                          ]);
                        }
                        setLoadingChart(false);
                      }
                    }}
                    style={styles.IndHabitCard}
                    key={_._id}>
                    {/* //TODO add the pie chart here with the image */}
                    <DonutChart
                      radius={60}
                      percentage={percentage ? percentage.percentage : 0}>
                      <Image
                        source={{
                          uri: _.habitIcon,
                        }}
                        style={{width: 80, height: 80, borderRadius: 100}}
                      />
                    </DonutChart>
                    <View style={styles.habitDetails}>
                      <Text style={styles.habitsDisplayHeading}>{_.title}</Text>
                      <Text style={styles.habitsDisplayDesc}>
                        {_.description}
                      </Text>
                      <View style={styles.timeline}>
                        <View style={styles.indTimeline}>
                          <CalendarIcon width={20} height={20} />
                          <Text style={styles.timelineText}>
                            {_.startTime.displayTime} - {_.endTime.displayTime}
                          </Text>
                        </View>
                        <View style={styles.weekInfo}>
                          {_.weeksSelected &&
                            _.weeksSelected.map(e => (
                              <Text style={styles.weekInfoText}>{e[0]}</Text>
                            ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : habitsLoading ? (
              <View
                style={{
                  justifyContent: 'center',
                  transform: [{translateY: height * 0.075}],
                  alignItems: 'center',
                }}>
                <LottiePlayer
                  autoPlay
                  loop
                  source={LoadingAnimation}
                  style={{width: 200, height: 200}}
                />
              </View>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  transform: [{translateY: height * 0.075}],
                  alignItems: 'center',
                  gap: height * 0.025,
                  padding: 20,
                  backgroundColor: themePurple,
                  borderRadius: 20,
                }}>
                <RegretIcon width={50} height={50} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: 20,
                    color: themeWhite,
                  }}>
                  No Habits Found..!
                </Text>
              </View>
            )}
          </ScrollView>
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
                  <Text style={styles.modelHeading}>Create Habit</Text>
                </View>
                <ScrollView
                  contentContainerStyle={styles.habitsContainerScroll}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}>
                  <ScrollView
                    contentContainerStyle={styles.habitsScroll}
                    horizontal
                    scrollEnabled={true}>
                    {habitsData.map(item => {
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.habitsCard,
                            {
                              transform: [
                                {scale: iconSelected === item.id ? 1.05 : 1},
                              ],
                              borderColor: themeGreen,
                              opacity: iconSelected === item.id ? 1 : 0.75,
                              borderWidth: iconSelected === item.id ? 5 : 0,
                            },
                          ]}
                          onPress={() => {
                            setIconSelected(item.id);
                            if (item.title == 'Cycling') {
                              setDefaultIcon(
                                'https://asset.cloudinary.com/deardiary/8b7b7cc9c7fa0fe85bad88d7630bf46f',
                              );
                            } else if (item.title == 'Jogging') {
                              setDefaultIcon(
                                'https://asset.cloudinary.com/deardiary/8b7b7cc9c7fa0fe85bad88d7630bf46f',
                              );
                            } else {
                              setDefaultIcon(
                                'https://asset.cloudinary.com/deardiary/0c149f7891a6317fd5d0ac185659d6b0',
                              );
                            }
                          }}>
                          <item.icon width={75} height={75} />
                          {iconSelected === item.id && (
                            <View
                              style={{
                                position: 'absolute',
                                padding: 10,
                                top: '-25%',
                                borderRadius: 20,
                                left: 0,
                                flexDirection: 'row',
                                gap: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 100,
                                backgroundColor: 'black',
                              }}>
                              <ClockIcon width={30} height={30} />
                              <Text
                                style={{
                                  fontFamily: 'OpenSans-Medium',
                                  fontSize: 14,
                                  color: themeBlue,
                                }}>
                                {duration &&
                                  duration.hours +
                                    'h ' +
                                    duration.minutes +
                                    ' m'}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      style={[
                        styles.habitsCard,
                        {
                          transform: [{scale: iconSelected === 4 ? 1.05 : 1}],
                          borderColor: themeGreen,
                          opacity: iconSelected === 4 ? 1 : 0.75,
                          borderWidth: iconSelected === 4 ? 5 : 0,
                        },
                      ]}
                      onPress={pickImage}>
                      {image ? (
                        <TouchableOpacity
                          onPress={pickImage}
                          style={styles.habitsCard}>
                          <Image
                            source={{uri: image.uri}}
                            resizeMode="cover"
                            style={{
                              width: '100%',
                              height: '100%',

                              borderRadius: 10,
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <PlusIcon width={50} height={50} />
                      )}
                      {iconSelected === 4 && (
                        <View
                          style={{
                            position: 'absolute',
                            padding: 10,
                            top: '-25%',
                            borderRadius: 20,
                            left: 0,
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            backgroundColor: 'black',
                          }}>
                          <ClockIcon width={30} height={30} />
                          <Text
                            style={{
                              fontFamily: 'OpenSans-Medium',
                              fontSize: 14,
                              color: themeBlue,
                            }}>
                            {duration &&
                              duration.hours + 'h ' + duration.minutes + ' m'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </ScrollView>
                  <View style={styles.habitInfoContainer}>
                    <TextInput
                      style={styles.input}
                      textColor={colors.themeBlue}
                      value={title}
                      placeholder="Add a title"
                      underlineColorAndroid="transparent"
                      placeholderTextColor={colors.themeBlue}
                      onChangeText={text => setTitle(text)}
                    />

                    <TextInput
                      style={styles.input}
                      textColor={colors.themeBlue}
                      value={description}
                      placeholder="Add a description"
                      underlineColorAndroid="transparent"
                      placeholderTextColor={colors.themeBlue}
                      onChangeText={text => setDescription(text)}
                    />
                    <View style={styles.timesContainer}>
                      <View
                        style={{
                          width: '45%',
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
                      <View
                        style={{
                          width: '45%',
                          marginLeft: '5%',
                        }}>
                        <TouchableOpacity
                          onPress={showEndTimePicker}
                          style={styles.timePickerContainer}>
                          <ClockIcon width={30} height={30} />
                          <Text
                            style={{
                              color: colors.themeWhite,
                              fontSize: 14,

                              fontFamily: 'Poppins-Medium',
                            }}>
                            {endTime ? endTime.displayTime : 'End Time'}
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
                      </View>
                    </View>
                    <ScrollView
                      contentContainerStyle={styles.weeksList}
                      horizontal>
                      {weeksData.map(item => {
                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.weeksCard,
                              {
                                backgroundColor: weeksSelected.includes(
                                  item.day,
                                )
                                  ? colors.themeBlack
                                  : colors.themeWhite,
                              },
                            ]}
                            onPress={() => {
                              if (!weeksSelected.includes(item.day)) {
                                setWeeksSelected(prev => [...prev, item.day]);
                              } else {
                                const filteredWeeks = weeksSelected.filter(
                                  week => week !== item.day,
                                );
                                setWeeksSelected(filteredWeeks);
                              }
                            }}>
                            <Text
                              style={[
                                styles.weeksText,
                                {
                                  color: weeksSelected.includes(item.day)
                                    ? colors.themeBlue
                                    : colors.themeBlack,
                                },
                              ]}>
                              {item.shortForm}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitHandler}>
                    <Text style={styles.submitText}> Create Habit</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent
            visible={Boolean(isHabitPageOpen)}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.75)'}}>
              <View style={{zIndex: 5}}>
                <Toast />
              </View>
              <ScrollView contentContainerStyle={styles.model}>
                <View
                  style={[
                    styles.infoContainer,
                    {
                      alignItems: 'center',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={backHandler}
                    style={{
                      backgroundColor: 'black',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 7.5,
                      borderRadius: 100,
                    }}>
                    <CrossIcon width={30} height={30} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.modelHeading,
                      {
                        paddingRight: '35%',
                      },
                    ]}>
                    {isHabitPageOpen && isHabitPageOpen.title}
                  </Text>
                </View>

                <View style={{marginTop: '5%', position: 'relative'}}>
                  <DonutChart
                    radius={95}
                    percentage={
                      //@ts-ignore
                      isHabitPageOpen != null
                        ? percentageCompleted.find(
                            i => i.id == isHabitPageOpen._id,
                          )
                          ? //@ts-ignore
                            percentageCompleted.find(
                              i => i.id == isHabitPageOpen._id,
                            ).percentage
                          : isHabitPageOpen.dates.find(
                              _ =>
                                moment(_.date).format('DD-MM-YYYY') ==
                                moment().format('DD-MM-YYYY'),
                            )
                          ? isHabitPageOpen.dates.find(_ => {
                              return (
                                moment(_.date).format('DD-MM-YYYY') ==
                                moment().format('DD-MM-YYYY')
                              );
                            }).percentage
                          : 0
                        : 0
                    }>
                    <Image
                      source={{
                        uri: isHabitPageOpen && isHabitPageOpen.habitIcon,
                      }}
                      style={{width: 130, height: 130, borderRadius: 100}}
                    />
                  </DonutChart>
                  <TouchableOpacity
                    style={{
                      backgroundColor: themeGreen,
                      maxWidth: 60,
                      paddingRight: 10,
                      paddingVertical: 10,
                      paddingLeft: 10,
                      borderRadius: 50,
                      position: 'absolute',
                      top: '-5%',
                      right: 0,
                    }}
                    onPress={() => {
                      if (timer == null) {
                        setTimer(
                          isHabitPageOpen.duration.hours * 3600 +
                            isHabitPageOpen.duration.minutes * 60 +
                            isHabitPageOpen.duration.seconds,
                        );
                      }
                      startTimer({
                        duration: isHabitPageOpen.duration,
                        id: isHabitPageOpen._id,
                      });
                      setIsHabitInProgress(true);
                    }}>
                    <PlayIcon width={40} height={40} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: '10%',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      color: themeLightWhite,
                      textAlign: 'center',
                    }}>
                    {isHabitPageOpen && isHabitPageOpen.description}{' '}
                  </Text>

                  <View
                    style={{
                      marginTop: '5%',
                      flexDirection: 'row',
                      width: width * 0.9,
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        backgroundColor: themeBlack,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: width * 0.025,
                        borderRadius: 20,
                      }}>
                      <ClockIcon width={30} height={30} />
                      <Text
                        style={{
                          color: themeWhite,
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                        }}>
                        {isHabitPageOpen &&
                          isHabitPageOpen.startTime.displayTime}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: themeBlack,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: width * 0.025,
                        borderRadius: 20,
                      }}>
                      <ClockIcon width={30} height={30} />
                      <Text
                        style={{
                          color: themeWhite,
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                        }}>
                        {isHabitPageOpen && isHabitPageOpen.endTime.displayTime}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: '10%',
                  }}>
                  <View
                    style={{
                      backgroundColor: themeBlack,
                      padding: 10,
                      width: width * 0.9,
                      alignItems: 'center',
                      borderRadius: 20,
                    }}>
                    {!loadingChart && (
                      <CalanderChart
                        data={
                          isHabitPageOpen &&
                          datesData.find(i => i.id == isHabitPageOpen._id).data
                        }
                      />
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: themeBlack,
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: themeWhite,
              fontFamily: 'Poppins-Bold',
              fontSize: 28,
            }}>
            {Math.floor(Math.floor((timer - 1) / 60) / 60) +
              ' hr ' +
              (Math.floor((timer - 1) / 60) % 60) +
              ' min ' +
              ((timer - 1) % 60) +
              ' s Left..!'}
          </Text>
          <TouchableOpacity
            onPress={stopTimer}
            style={{
              backgroundColor: themeWhite,
              padding: 10,
              width: width * 0.5,
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: themeGrey,
                fontSize: 20,
                fontFamily: 'Poppins',
              }}>
              Exit
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Habits;

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
  plusIcon: {
    position: 'absolute',
    top: '85%',
    zIndex: 100,
    backgroundColor: colors.themePurple,
    borderRadius: 100,
    padding: 10,
  },
  model: {
    height: height / 1.15,
    width: width,
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
    paddingRight: '25%',
  },
  habitsContainerScroll: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsScroll: {
    marginTop: height * 0.05,
    // flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.22,
    paddingHorizontal: width * 0.02,
    gap: width * 0.05,
  },
  habitsCard: {
    width: width * 0.3,
    zIndex: -1,
    borderRadius: 10,
    height: height * 0.15,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: themeLightBlue,
  },
  habitInfoContainer: {
    width: width * 0.9,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    gap: height * 0.025,
  },
  input: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    width: width * 0.85,
    borderBottomLeftRadius: 10,
    backgroundColor: themeBlack,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: themeBlack,
    borderRadius: 20,
    padding: 10,
    width: '100%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  weeksList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  weeksCard: {
    borderRadius: 100,
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  weeksText: {
    fontSize: 20,
    color: themeBlue,
    fontFamily: 'Poppins-Medium',
  },
  submitButton: {
    backgroundColor: themeBlack,
    marginVertical: '10%',
    borderRadius: 10,
    padding: 15,
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  submitText: {
    color: themePurple,
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
  habitsDisplayContainer: {
    flexDirection: 'column',
    minHeight: height * 0.75,
    alignItems: 'center',
    zIndex: -1,
    gap: height * 0.05,
    paddingBottom: height * 0.1,
    marginTop: '5%',
  },
  IndHabitCard: {
    width: width * 0.85,
    borderRadius: 50,
    backgroundColor: themeLightYellow,
    flexDirection: 'row',
    gap: 10,
  },
  habitDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  habitsDisplayHeading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: themeBlack,
  },
  habitsDisplayDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: themeGrey,
  },
  indTimeline: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  timeline: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
    gap: 10,
  },
  timelineText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: themeGrey,
  },
  weekInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: width * 0.4,
    gap: 5,
  },
  weekInfoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: themeYellow,
    backgroundColor: themeBlack,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 50,
  },
  indHabitPage: {
    width: width,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    height: height / 1.25,
    backgroundColor: 'black',
  },
});
