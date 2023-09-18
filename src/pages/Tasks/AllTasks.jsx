import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors, {themeYellow} from '../../utils/colors';
import {useDispatch} from 'react-redux';
import personRunning from '../../../assets/videos/man-running.json';
import Lottie from 'lottie-react-native';
import moment from 'moment';
import {useSelector} from 'react-redux';
import AwardIcon from '../../../assets/icons/award.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import StatusIcon from '../../../assets/icons/status.svg';
import CategoryIcon from '../../../assets/icons/category.svg';
import CrossIcon from '../../../assets/icons/cross.svg';
import {TextInput} from 'react-native-paper';
import SearchIcon from '../../../assets/icons/search.svg';
import DonutChart from '../../components/charts/DonutChart';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import EditIcon from '../../../assets/icons/pencil.svg';
import DeleteIcon from '../../../assets/icons/delete.svg';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {addTask} from '../../features/Tasks/TasksSlice';
import PopUpModal from '../../components/modal/Modal';
// import Animated, {
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

const taskColors = [
  '#FBCBB9',
  '#B9F3E4',
  '#C0DEFF',
  '#FFACAC',
  '#E4F2FB',
  '#FD8A8A',
];
const clog = console.log;
const AllTasks = ({navigation}) => {
  const [sortByCategorySelected, setSortByCategorySelected] = useState(false);
  const [sortByStatusSelected, setSortByStatusSelected] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [sortByDateSelected, setSortByDateSelected] = useState(false);
  const {tasks} = useSelector(state => state.tasks);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const [Tasks, setTasks] = useState(null);
  const router = useRoute();
  const {reload, fetch, points} = router.params;
  const [fetched, setFetched] = useState(fetch);
  if (reload) {
    fetchMainTasks();
  }
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  useEffect(() => {
    if (!pointsModalOpen) {
      setPointsModalOpen(true);
    }
  }, [points]);
  async function fetchMainTasks() {
    console.log('FETCHED VALUE ===', !fetched);
    console.log('=== USERID ===', user._id);
    if (!fetched) {
      console.log('=== FETCHING MAIN TASKS ===');
      const url = `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${user._id}/main-tasks`;
      console.log('=== URL ===', url);
      try {
        const {data} = await axios.get(url);
        console.log('=== DATA ===', data);
        setTasks(data.tasks);
        dispatch(addTask(data.tasks));
        console.log('=== MAIN TASKS FETCHED ===');
        setFetched(!fetched);
      } catch (error) {
        console.log('error', error);
        setFetched(!fetched);
      }
    }
  }
  useEffect(() => {
    clog('==== MAIN TASKS LOADED ====');
    setLoading(true);
    setFetched(false);
    console.log('=== RELOAD VALUE ===', reload);
    if (reload) {
      fetchMainTasks();
    } else {
      if (Tasks && Tasks.length < 1) {
        console.log('==== SETTING TASKS TO THE STATE ====');
        setTasks(tasks);
      }
    }
    setLoading(false);
    onRefresh();
  }, [reload]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setFetched(false);
    fetchMainTasks();
    setSortByCategorySelected(false);
    setSortByDateSelected(false);
    setSortByStatusSelected(false);
    console.log('=== RELOADED ===');

    console.log('tasks', tasks);
    setLoading(true);
    setTasks(tasks);
    setLoading(false);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const sortByCategory = (a, b) => {
    if (a.category > b.category) {
      return 1;
    } else if (b.category > a.category) {
      return -1;
    } else {
      return 0;
    }
  };
  const sortByCategoryHandler = () => {
    setTasks([...tasks].sort(sortByCategory));
    setSortByCategorySelected(true);
    setSortByStatusSelected(false);
    setSortByDateSelected(false);
  };
  const sortByStatus = (a, b) => {
    if (a.status == 'working' && b.status == 'completed') {
      return -1;
    } else if (b.status == 'working' && a.status == 'completed') {
      return 1;
    } else {
      return 0;
    }
  };
  const sortByDate = (a, b) => {
    if (a.start > b.start) {
      return 1;
    } else if (b.start > a.start) {
      return -1;
    } else {
      return 0;
    }
  };
  const deleteHandler = async task => {
    try {
      console.log('DELETE REQUEST SENT');
      const response = await axios.delete(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/tasks/${user._id}/main-tasks/${task._id}`,
      );
      console.log('DELETE REQUEST DONE');
      if (response.status === 200) {
        onRefresh();
      }
    } catch (error) {
      console.log('DELETE REQUEST FAILED');
    }
  };
  const sortByDateHandler = () => {
    setTasks([...tasks].sort(sortByDate));
    setSortByStatusSelected(false);
    setSortByCategorySelected(false);
    setSortByDateSelected(true);
  };
  const sortByStatusHandler = () => {
    setTasks([...tasks].sort(sortByStatus));
    setSortByStatusSelected(true);
    setSortByCategorySelected(false);
    setSortByDateSelected(false);
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            width: '100%',
            paddingBottom: 20,
            backgroundColor: 'black',
            paddingLeft: 15,
            paddingTop: 10,
            paddingRight: 15,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('user', {
                  name: 'user',
                })
              }>
              <CrossIcon width={30} height={30} />
            </TouchableOpacity>
            <Text style={styles.infoText}>Tasks</Text>
            <TouchableOpacity style={{width: 30, height: 30}} />
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Your Tasks"
                activeUnderlineColor="transparent"
                textColor="rgba(255, 255, 255, 0.75)"
                contentStyle={{fontFamily: 'Poppins-Medium'}}
                onChangeText={text => {
                  if (text.length > 0) {
                    const searchedTasks = Tasks.filter(task => {
                      return task.title.includes(text);
                    });
                    setTasks(searchedTasks);
                  } else {
                    setTasks(tasks);
                  }
                }}
                placeholderTextColor={colors.themePurple}
                theme={{
                  colors: {
                    primary: colors.themePurple,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <SearchIcon
                width={30}
                height={30}
                style={{
                  position: 'absolute',
                  right: '5%',
                  top: '25%',
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}> Sort By</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              onPress={sortByCategoryHandler}
              style={[
                styles.option,
                {
                  flex: 1.25,
                  transform: [
                    {
                      scale: sortByCategorySelected ? 1.05 : 1,
                    },
                  ],
                  backgroundColor: sortByCategorySelected
                    ? colors.themeWhite
                    : 'black',
                },
              ]}>
              <CategoryIcon width={25} height={25} />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: sortByCategorySelected ? 'black' : colors.themeWhite,
                  },
                ]}>
                Category
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                {
                  flex: 1,
                  transform: [
                    {
                      scale: sortByStatusSelected ? 1.05 : 1,
                    },
                  ],
                  backgroundColor: sortByStatusSelected
                    ? colors.themeWhite
                    : 'black',
                },
              ]}
              onPress={sortByStatusHandler}>
              <StatusIcon width={25} height={25} />
              <Text
                style={[
                  styles.optionText,
                  [
                    {
                      color: sortByStatusSelected ? 'black' : colors.themeWhite,
                    },
                  ],
                ]}>
                Status
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sortByDateHandler}
              style={[
                styles.option,
                {
                  flex: 1,
                  transform: [
                    {
                      scale: sortByDateSelected ? 1.05 : 1,
                    },
                  ],
                  backgroundColor: sortByDateSelected
                    ? colors.themeWhite
                    : 'black',
                },
              ]}>
              <ClockIcon width={25} height={25} />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: sortByDateSelected ? 'black' : colors.themeWhite,
                  },
                ]}>
                Date
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.mainTaskContainer}>
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => {
              console.log('==== TASK STATUS ====', task.status);
              let percentage = 0;
              if (task.workingTasks === 0 && task.completedTasks === 0)
                return (percentage = 0);
              if (task.workingTasks && task.completedTasks) {
                if (task.assignedTasks.length === task.completedTasks.length)
                  percentage = task.assignedTasks.length > 0 ? 100 : 0;
                else {
                  percentage = Math.ceil(
                    (task.completedTasks.length / task.assignedTasks.length) *
                      100 >=
                      100
                      ? 100
                      : Math.ceil(
                          (task.completedTasks.length /
                            task.assignedTasks.length) *
                            100,
                        ),
                  );
                }
              }
              const color = colors.categories.filter(category => {
                if (category.value === task.category) return category;
              });
              console.log(
                "Task's Percentage:",
                task.completedTasks.length + task.assignedTasks.length,
              );
              return (
                <Swipeable
                  renderLeftActions={(progress, dragX) => {
                    return (
                      <TouchableOpacity
                        style={{
                          padding: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          navigation.navigate('edit-task', {task})
                        }>
                        <EditIcon width={45} height={45} />
                      </TouchableOpacity>
                    );
                  }}
                  renderRightActions={() => {
                    return (
                      <TouchableOpacity
                        style={{
                          padding: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => deleteHandler(task)}>
                        <DeleteIcon width={45} height={45} />
                      </TouchableOpacity>
                    );
                  }}
                  key={index}>
                  <TouchableOpacity
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: height / 5,
                      backgroundColor:
                        task.status === 'completed'
                          ? colors.themeGreen
                          : task.status === 'working'
                          ? colors.themeYellow
                          : colors.themeRed,
                      borderRadius: 20,
                      marginBottom: index === tasks.length - 1 ? 20 : 0,
                    }}
                    key={index}
                    onPress={() =>
                      navigation.navigate('ind-task', {task: task})
                    }>
                    <View style={[styles.taskContainer, {}]}>
                      <View style={styles.leftSideContent}>
                        <Text style={styles.taskHeading}>{task.title}</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <AwardIcon width={30} height={30} />
                          <Text style={styles.todaysTasksCardDetail}>
                            {moment(task.start).format('D MMM')} -{' '}
                            {moment(task.deadline).format('D MMM')}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '90%',
                            justifyContent: 'center',
                            gap: 5,
                            padding: 10,
                            marginTop: 5,
                            borderRadius: 20,
                            backgroundColor:
                              color.length > 0
                                ? color[0].color
                                : colors.themeBlack,
                          }}>
                          <Text style={styles.categoryText}>
                            {color.length > 0
                              ? color[0].label[0].toUpperCase() +
                                color[0].label.slice(1)
                              : 'No Category'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.rightSideContent}>
                        <DonutChart
                          image={null}
                          strokeWidth={width / 16}
                          radius={width / 6}
                          percentage={percentage % 101}
                          color={
                            percentage > 60
                              ? colors.themeGreen
                              : percentage > 30
                              ? colors.themeYellow
                              : colors.themeRed
                          }
                          text={`${percentage}`}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              );
            })
          ) : Loading ? (
            <View style={styles.ErrorPage}>
              <Lottie
                source={personRunning}
                autoPlay
                loop
                style={styles.animationLoadingCharacter}
              />
              <TouchableOpacity onPress={() => navigation.navigate('register')}>
                <Text style={styles.ErrorText}>Fetching Main Tasks..!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.ErrorPage}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-Medium',
                  color: colors.themeWhite,
                  transform: [{translateY: -height / 15}],
                }}>
                No Tasks Assigned
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: themeYellow,
                  padding: 15,
                  borderRadius: 12,
                }}
                onPress={() => navigation.navigate('create-task')}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                    color: colors.themeGrey,
                  }}>
                  Add Tasks
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      {points && (
        <PopUpModal
          modalVisible={pointsModalOpen}
          setModalVisible={setPointsModalOpen}
          points={points}
        />
      )}
    </GestureHandlerRootView>
  );
};

export default AllTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: colors.themeBlack,
  },
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
  mainContainer: {
    gap: 10,
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'black',
    borderRadius: 20,
    marginTop: '10%',

    position: 'relative',
  },
  searchInput: {
    backgroundColor: colors.themeBlack,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.themePurple,
    borderWidth: 1,
    width: width - 60,
  },
  sortContainer: {
    width: '100%',
    padding: 20,
  },
  sortText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: '5%',
  },
  ErrorPage: {
    height: '100%',
    padding: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationLoadingCharacter: {
    width: width,
    height: height / 3,
    position: 'absolute',
    top: 0,
  },
  ErrorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    transform: [{translateY: 50}],
    color: colors.themeWhite,
  },
  ErrorTextMessage: {
    fontFamily: 'Lato-Medium',
    maxWidth: '70%',
    textAlign: 'center',
    fontSize: 16,
    color: colors.themePurple,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'black',
  },
  optionText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  mainTaskContainer: {
    marginTop: '5%',
    backgroundColor: 'black',
    minHeight: height / 1.5,
    width: width - 20,
    padding: 20,
    borderTopRightRadius: 40,
    gap: 20,
    borderTopLeftRadius: 40,
  },
  taskContainer: {
    width: '97.5%',
    right: 0,
    height: '100%',
    flexDirection: 'row',
    padding: 10,
    position: 'absolute',
    justifyContent: 'space-between',
    backgroundColor: colors.themePurple,
    borderRadius: 12,
  },
  taskHeading: {
    color: colors.themeWhite,
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  todaysTasksCardDetail: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lato-Bold',
  },
  leftSideContent: {
    maxWidth: '60%',
  },
  rightSideContent: {},
  categoryText: {
    color: colors.themeBlack,
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
});

//create  a prime number function
