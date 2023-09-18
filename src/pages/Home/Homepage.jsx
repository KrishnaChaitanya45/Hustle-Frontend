import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TabContainer from '../../components/Tab/TabContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors, {themeGrey} from '../../utils/colors';
import personRunning from '../../../assets/videos/man-running.json';
import Lottie from 'lottie-react-native';
import AngelCIcon from '../../../assets/icons/angel.svg';
import RegretIcon from '../../../assets/icons/cry.svg';
import AwardIcon from '../../../assets/icons/award.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import LinearGradient from 'react-native-linear-gradient';
import DonutChart from '../../components/charts/DonutChart';
import moment from 'moment';
import {io} from 'socket.io-client';
import {
  addGroupChats,
  addMessagesSocket,
  addPersonalChats,
  addUserSocket,
} from '../../features/Socket/SocketSlice';
import {
  addHabits,
  addTask,
  addTodaysTask,
} from '../../features/Tasks/TasksSlice';
import {addFriends, addUser} from '../../features/users/UserSlice';
const {width, height} = Dimensions.get('window');
const Homepage = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const {tasks} = useSelector(state => state.tasks);
  const {user} = useSelector(state => state.user);
  const [habits, setHabits] = useState(null);
  const [habitsLoading, setHabitsLoading] = useState(null);
  const [workingTasks, setWorkingTasks] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState(null);
  const [LoadingWorkingTasks, setLoadingWorkingTasks] = useState(false);
  const [LoadingTodaysTasks, setLoadingTodaysTasks] = useState(false);
  const token = useSelector(state => state.socket.deviceToken);
  const [Loading, setLoading] = useState(true);
  let message = {
    title: 'Fetching Tasks..!',
    description: 'We are glad to have you here, please wait..!',
  };
  const dispatch = useDispatch();
  const fetchFriends = async () => {
    console.log('================= FETCHING FRIENDS ===================');
    try {
      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/friends/${userData._id}`,
      );
      console.log('RESPONSE', response);
      if (response.status == 200 || response.status == 201) {
        dispatch(addFriends(response.data.friends));
        console.log('=== FETCHED FRIENDS ===', response.data);
      } else {
        throw new Error('Error fetching friends');
      }
    } catch (error) {
      console.log('=== ERROR FETCHING FRIENDS ===', error);
    }
  };
  const fetchGroupChats = async () => {
    try {
      console.log('REQUEST SENT');
      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${userData._id}?onlyGroup=true`,
      );
      if (response.status == 200 || response.status == 201) {
        dispatch(addGroupChats(response.data));
        console.log('=== FETCHED GROUP CHATS ===', response.data);
      } else {
        throw new Error('Error fetching group chats');
      }
    } catch (error) {
      console.log('REQUEST FAILED');
    }
  };
  const getUserDetails = async () => {
    try {
      console.log('TRIED TO FETCH COOKIE');
      const cookie = await AsyncStorage.getItem('deardiary');
      console.log(cookie);
      // console.log(cookie);
      let url = `http://192.168.1.16:5000/api/v1/auth/login/user-details/${cookie}/${token}`;
      console.log(url);
      try {
        const response = await fetch(url, {
          method: 'GET',

          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data.user);
        setUserData(data.user);
        dispatch(addUser(data.user));
        return data.user;
      } catch (error) {
        showToast(
          'Server Side Error 😢..!',
          "We'll fix this error thanks for being patient 😄..!",
          'error',
        );
        console.log(error);
      }
    } catch (error) {
      // showToast(
      //   'Something went wrong 😢..!',
      //   "We'll fix this error thanks for being patient 😄..!",
      //   'error',
      // );
      setTimeout(() => {
        navigation.navigate('login');
      }, 3000);
      console.log("Something went wrong, we'll fix it soon");
    }
  };
  const fetchWorkingTasks = async () => {
    const userId = userData._id;
    if (tasks.length === 0) {
      try {
        const response = await fetch(
          `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${userId}/main-tasks`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        setWorkingTasks(data.tasks.filter(task => task.status === 'working'));
        dispatch(addTask(data.tasks));

        if (data.tasks.length === 0) {
          message = {
            title: 'No Tasks Found',
            description: 'Add some tasks to work on..!',
          };
        }
      } catch (err) {
        console.log('tasks fetch request error');
      }
    } else {
      const workingTasksFromTasks = tasks.filter(task => {
        return task.status === 'working';
      });
      console.log(workingTasksFromTasks);
      setWorkingTasks(workingTasksFromTasks);
    }
  };
  const fetchHabits = async () => {
    const userId = userData._id;
    const url = `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/habits/${userId}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      setHabits(data.habits);
      dispatch(addHabits(data.habits));
    } catch (error) {
      console.log('=== ERROR ===');
    }
  };
  const fetchTodaysTasks = async () => {
    const userId = userData._id;

    const today = moment(moment().format('YYYY-MM-DD')).toISOString();
    console.log(today);
    const url = `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${userId}/main-tasks?todaysTasks`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      dispatch(addTodaysTask(data.tasks));
      console.log('todays tasks', data.tasks);
      setTodaysTasks(data.tasks.slice(0, 3));
    } catch (err) {
      console.log('tasks fetch request error');
    }
  };
  const addSockets = async () => {
    let userSocket = io('https://tame-rose-monkey-suit.cyclic.app/users', {
      transports: ['websocket'],
      reconnection: true,
      auth: {
        userId: userData._id,
      },
      reconnectionAttempts: 2,
    });
  };
  const fetchOneToOneChats = async () => {
    try {
      console.log('REQUEST SENT');

      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${userData._id}?onlyPersonal=true`,
      );
      if (response.status == 200 || response.status == 201) {
        dispatch(addPersonalChats(response.data));
        console.log('=== FETCHED PERSONAL CHATS ===', response.data);
      } else {
        throw new Error('Error fetching group chats');
      }
    } catch (error) {
      console.log('REQUEST FAILED OnE TO OnE CHATS', error);
    }
  };
  useEffect(() => {
    console.log('==== Initial Loading =====');
    setLoading(true);
    if (!userData && token) {
      console.log('fetched user');
      getUserDetails();
      console.log('done');
    }
    console.log('fetched');
    setLoading(false);
    if (userData) {
      addSockets();
      fetchGroupChats();
      fetchOneToOneChats();

      fetchFriends();
      setLoadingWorkingTasks(true);
      fetchWorkingTasks();
      setLoadingWorkingTasks(false);
      setLoadingTodaysTasks(true);
      fetchTodaysTasks();
      setLoadingTodaysTasks(false);
      setHabitsLoading(true);
      fetchHabits();
      setHabitsLoading(false);
      setLoading(false);
    }
  }, [userData, token]);

  return (
    <TabContainer>
      {userData && !Loading ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.upperContainer}>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.uppertext}>Hi {userData.name}</Text>
              <Text style={styles.lowertext}>
                {userData.assignedTasks.length -
                  userData.completedTasks.length >
                0
                  ? `You have ${
                      userData.assignedTasks.length -
                      userData.completedTasks.length
                    } pending tasks 😢 `
                  : `You have no pending tasks😇`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('profile')}>
              <Image
                source={{uri: userData.profilePhoto}}
                style={styles.userProfile}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.subContainer,
              {
                height: '25%',
                maxHeight: 200,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                height: '20%',
                maxHeight: 25,
              }}>
              <Text style={styles.subHeader}>My Goals</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('all-tasks', {
                    reload: true,
                    userId: userData._id,
                    fetch: false,
                  })
                }>
                <RightArrow width={30} height={30} />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                maxHeight: 175,
                gap: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              horizontal>
              {workingTasks && workingTasks.length > 0 ? (
                workingTasks.map((task, index) => {
                  const percentage =
                    Math.floor(
                      (task.completedTasks.length / task.subtasks.length) * 100,
                    ) >= 100
                      ? 100
                      : Math.floor(
                          (task.completedTasks.length / task.subtasks.length) *
                            100,
                        );
                  let color;
                  if (percentage < 50) {
                    color = colors.themeRed;
                  } else if (percentage < 80) {
                    color = colors.themeYellow;
                  } else {
                    color = colors.themeGreen;
                  }
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('ind-task', {
                          task,
                        })
                      }
                      style={styles.indTaskContainer}>
                      <View style={styles.indTask}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.taskDescription}>
                          {task.subtasks.length > 0
                            ? `You have ${task.subtasks.length} subtasks`
                            : 'No subtasks for this task'}
                        </Text>
                        <View style={styles.progressContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {
                                width: `${percentage ? percentage : 0}%`,
                                backgroundColor: color,
                              },
                            ]}></View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : LoadingWorkingTasks ? (
                <View style={styles.indTaskContainer}>
                  <View style={styles.indTask}>
                    <Text style={styles.taskTitle}>{message.title}</Text>
                    <Text style={styles.taskDescription}>
                      {message.description}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={[
                    styles.indTaskContainer,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <View style={[styles.indTask, {}]}>
                    <RegretIcon width={50} height={50} />
                    <Text style={styles.taskTitle}>No Working Tasks..!</Text>
                    <Text style={styles.taskDescription}>
                      You have no tasks to work on, please add some tasks
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
          <View
            style={[
              styles.subContainer,
              {
                marginTop: 5,
                height: '20%',
                maxHeight: 175,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.subHeader}>My Habits</Text>
              <TouchableOpacity onPress={() => navigation.navigate('habits')}>
                <RightArrow width={30} height={30} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                gap: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              horizontal>
              {!habitsLoading && habits && habits.length > 0 ? (
                habits.map((_, index) => {
                  let percentage = 0;
                  let percentageExits = _.dates.find(i => {
                    return (
                      moment(i.date).format('DD-MM-YYYY') ==
                      moment().format('DD-MM-YYYY')
                    );
                  });
                  if (percentageExits) {
                    percentage = percentageExits.percentage;
                  }
                  return (
                    <DonutChart percentage={percentage} radius={55} key={index}>
                      <Image
                        source={{uri: _.habitIcon}}
                        style={{
                          width: 75,
                          height: 75,
                          borderRadius: 50,
                        }}
                      />
                    </DonutChart>
                  );
                })
              ) : !habitsLoading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.7,
                    backgroundColor: themeGrey,
                    borderRadius: 10,
                    height: height / 10,
                  }}>
                  <Text
                    style={{
                      color: colors.themeWhite,
                      fontSize: 20,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    No Habits Found
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.7,
                    backgroundColor: themeGrey,
                    borderRadius: 10,
                    height: height / 10,
                  }}>
                  <Text
                    style={{
                      color: colors.themeWhite,
                      fontSize: 20,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Fetching Habits
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
          {/* //TODO render tasks which are due today and they should not be more  than 3 */}

          <View
            style={{
              width: '85%',
              height: 550,
              marginBottom: 50,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.subHeader}>Todays Tasks</Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate('tasks')}>
                <RightArrow width={30} height={30} />
              </TouchableOpacity> */}
            </View>
            <View style={{gap: 10, marginTop: 10}}>
              {!LoadingTodaysTasks && todaysTasks && todaysTasks.length > 0 ? (
                todaysTasks.map((task, index) => {
                  return (
                    <View style={styles.todaysTasksCard} key={index}>
                      {task.status === 'working' ||
                      task.status === 'completed' ? (
                        <AngelCIcon width={45} height={45} />
                      ) : (
                        <RegretIcon width={45} height={45} />
                      )}
                      <View>
                        <Text style={styles.todaysTasksCardText}>
                          {task.title.slice(0, 20)}...
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                          }}>
                          <AwardIcon width={25} height={25} />
                          <Text style={styles.todaysTasksCardDetail}>
                            {moment(task.startTime).format('hh:mm A')} -{' '}
                            {moment(task.endTime).format('hh:mm A')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : LoadingTodaysTasks ? (
                <View style={styles.todaysTasksCard}>
                  <View>
                    <Text style={styles.todaysTasksCardText}>
                      Loading Tasks...
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.todaysTasksCard}>
                  <RegretIcon width={45} height={45} />
                  <View>
                    <Text style={styles.todaysTasksCardText}>
                      No Tasks for Today
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.ErrorPage}>
          <Lottie
            source={personRunning}
            autoPlay
            loop
            style={styles.animationLoadingCharacter}
          />
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.ErrorText}>Fetching Tasks..!</Text>
          </TouchableOpacity>
        </View>
      )}
    </TabContainer>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  upperContainer: {
    width: '100%',
    height: '15%',
    maxHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  uppertext: {
    fontSize: 22,
    color: '#fefefe',
    fontFamily: 'Poppins-Medium',
  },
  lowertext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Poppins-Medium',
  },
  userProfile: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  subContainer: {
    width: '90%',
    paddingLeft: 10,
  },
  subHeader: {
    fontSize: 20,
    color: colors.themePurple,
    fontFamily: 'Poppins-Medium',
  },

  taskTitle: {
    fontSize: 20,
    color: colors.themeWhite,
    fontFamily: 'Poppins-Medium',
  },
  taskDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lato-Medium',
  },
  progressContainer: {
    width: '90%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginTop: 30,
  },
  indTaskContainer: {
    width: 250,
    height: '80%',
    backgroundColor: colors.themeGrey,
    borderRadius: 10,
    shadowColor: colors.themeBlue,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 30,
    padding: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  habitContainer: {
    width: 90,
    height: '80%',
    backgroundColor: colors.themeBlack,
    borderWidth: 5,
    borderColor: colors.themeYellow,
    borderRadius: 100,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 30,
    padding: 10,
  },
  ErrorPage: {
    height: '100%',
    padding: '10%',
    alignItems: 'center',
    backgroundColor: colors.themeBlack,
    justifyContent: 'center',
  },
  animationLoadingCharacter: {
    width: width,
    height: height / 2,
    position: 'absolute',
    top: '10%',
  },
  ErrorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    transform: [{translateY: 100}],
    color: colors.themeWhite,
  },
  ErrorTextMessage: {
    fontFamily: 'Lato-Medium',
    maxWidth: '70%',
    textAlign: 'center',
    fontSize: 16,
    color: colors.themePurple,
  },
  todaysTasksCard: {
    width: '100%',
    height: 100,
    textAlign: 'center',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: colors.themeYellow,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 20,
    backgroundColor: colors.themeBlack,
    marginTop: 5,
  },
  todaysTasksCardText: {
    fontSize: 16,
    color: colors.themeWhite,
    fontFamily: 'Poppins-Bold',
  },
  todaysTasksCardDetail: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lato-Bold',
  },
});
