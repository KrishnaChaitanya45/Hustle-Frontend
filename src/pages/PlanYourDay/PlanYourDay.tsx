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
const {width, height} = Dimensions.get('window');

const PlanYourDay = ({navigation}: {navigation: any}) => {
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [currentActiveMonth, setCurrentActiveMonth] = React.useState<number>(
    moment().month(),
  );

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
        <StepperComponent />
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
