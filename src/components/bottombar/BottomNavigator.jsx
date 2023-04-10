import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeIcon from '../../../assets/icons/home.svg';
import Homepage from '../../pages/Home/Homepage';
import DiaryIcon from '../../../assets/icons/diary-icon.svg';
import ProfileIcon from '../../../assets/icons/profile.svg';
import AddButton from '../../../src/components/bottombar/AddButton';
import {useTabMenu} from '../../contexts/TabContexts';
import CommunityIcon from '../../../assets/icons/community.svg';
import UserProfile from '../../pages/User/UserProfile';
import CommunityHome from '../../pages/Community/CommunityHome';
import DiaryHomePage from '../../pages/Diary/DiaryHomePage';
import {useRoute} from '@react-navigation/native';
const BottomNavigator = ({navigation}) => {
  const Tab = createBottomTabNavigator();
  const getIconColor = focused => ({
    opacity: focused ? 1 : 0.65,
  });
  const {opened, toggleOpened} = useTabMenu();
  const route = useRoute();
  return (
    <Tab.Navigator
      initialRouteName={route.params ? `${route.params.page}` : 'home'}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="home"
        component={Homepage}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <HomeIcon width={30} height={30} style={getIconColor(focused)} />
            </View>
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="diary"
        component={DiaryHomePage}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <DiaryIcon width={30} height={30} style={getIconColor(focused)} />
            </View>
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="add"
        component={Homepage}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarButton: () => (
            <AddButton
              opened={opened}
              toggleOpened={toggleOpened}
              navigation={navigation}
            />
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      />

      <Tab.Screen
        name="community"
        component={CommunityHome}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <CommunityIcon
                width={30}
                height={30}
                style={getIconColor(focused)}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="profile"
        component={UserProfile}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <ProfileIcon
                width={40}
                height={40}
                style={getIconColor(focused)}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: e => opened && e.preventDefault(),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    height: 54,
    borderRadius: 16,
    borderTopColor: 'transparent',
    backgroundColor: '#17181A', //f9f9f9
    shadowColor: '#595BD4',
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
    padding: 0,
  },
});
