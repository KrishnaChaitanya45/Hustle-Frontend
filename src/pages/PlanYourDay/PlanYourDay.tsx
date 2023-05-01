import {Dimensions, SectionList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native';
import WeekCalander from '../../components/eventCalander/WeekCalander';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import colors, {themeBlack, themeGrey} from '../../utils/colors';
//@ts-ignore
import CrossIcon from '../../../assets/icons/cross.svg';
//@ts-ignore
import OptionsIcon from '../../../assets/icons/more.svg';
import ScrollableWeekCalander from '../../components/eventCalander/ScrollableWeekCalander';
import StepperComponent from '../../components/stepper/StepperComponent';
import {useSelector} from 'react-redux';
import axios from 'axios';
const {width, height} = Dimensions.get('window');

const PlanYourDay = ({navigation}: {navigation: any}) => {
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [currentActiveMonth, setCurrentActiveMonth] = React.useState<number>(
    moment().month(),
  );

  const tasksData = [
    {
      id: Math.random().toString(),
      time: '10:00 AM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '11:00 AM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '12:00 AM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '01:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '02:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '03:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '04:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '05:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '06:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '07:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '08:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '09:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '10:00 PM',
      tasks: [],
    },
    {
      id: Math.random().toString(),
      time: '11:00 PM',
      tasks: [],
    },
  ];
  const {tasks} = useSelector((state: any) => state.tasks);
  const [data, setData] = useState(tasksData);

  const fetchSelectedDateData = async (date: moment.Moment) => {
    try {
      const taskdata = await tasks.filter((task: any) => {
        const startDate = task.start;
        const endDate = moment(task.deadline).add(1, 'days');
        const selectedDateDay = moment(date).date();
        // const selectedDateMonth = moment(currentActiveMonth, 'm').month();
        const selectedDate = moment()
          .set('date', selectedDateDay)
          .set('month', currentActiveMonth);

        const isBetween = moment(selectedDate).isBetween(startDate, endDate);
        console.log(isBetween);
        return isBetween;
      });
      const formattedData = taskdata.map((task: any) => {
        const id = task._id;
        const title = task.title;
        const description = task.description;
        const time = task.startTime.displayTime;
        const fullTime =
          moment(time, 'hh:mm a').hours() > 12
            ? `${moment(time, 'hh:mm a').hours() - 12}:00 PM`
            : `${moment(time, 'hh:mm a').hours()}:00 AM`;

        const durationInSeconds = moment(task.endTime.toCalculate).diff(
          moment(task.startTime.toCalculate),
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
        const duration = `${hours}:${minutes}:${seconds}`;
        const isCompleted = task.status === 'completed' ? true : false;
        const isStarted = task.status === 'working' ? true : false;
        setData((prevData: any) => {
          const newData = [...prevData];
          const index = newData.findIndex(
            (item: any) => item.time === fullTime,
          );
          if (index >= 0) {
            console.log('taskfound');
            newData[index].tasks.push({
              id,
              title,
              description,
              redirectTask: task,
              time,
              duration,
              isCompleted,
              isStarted,
            });
          }
          return newData;
        });
      });
    } catch (error) {
      console.log('error file fetching');
    }
  };
  React.useEffect(() => {
    fetchSelectedDateData(selectedDate);

    setData(tasksData);
  }, [selectedDate]);
  console.log(data);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          backgroundColor: themeBlack,
          paddingTop: 10,
          paddingHorizontal: 5,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}>
        <View style={{zIndex: 5}}>
          <Toast />
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('user', {
                name: 'user',
              });
              console.log('black');
            }}
            style={styles.crossIcon}>
            <CrossIcon width={30} height={30} />
          </TouchableOpacity>
          <Text style={styles.infoText}>Plan for the Day</Text>
          <TouchableOpacity />
          <TouchableOpacity style={styles.optionsButton}>
            <OptionsIcon width={25} height={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.weekCalanderView}>
          <ScrollableWeekCalander
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setCurrentActiveMonth={setCurrentActiveMonth}
            currentActiveMonth={currentActiveMonth}
          />
        </View>
      </View>
      <View>
        <StepperComponent data={data} navigation={navigation} />
      </View>
    </ScrollView>
  );
};

export default PlanYourDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'black',
    paddingLeft: 5,
  },
  infoText: {
    fontSize: 20,
    textAlign: 'center',
    paddingLeft: 20,
    fontFamily: 'Poppins-Medium',
    color: colors.themePurple,
  },
  crossIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: `rgba(0,0,0,0.4)`,
  },
  infoContainer: {
    width: '95%',
    height: 50,
    marginLeft: '2.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  optionsButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: `rgba(0,0,0,0.4)`,
  },
  weekCalanderView: {
    width: '100%',
    height: width * 0.425,
    borderRadius: 20,
  },
});
