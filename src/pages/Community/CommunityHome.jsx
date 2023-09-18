import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import TabContainer from '../../components/Tab/TabContainer';
import FireIcon from '../../../assets/icons/fire.svg';
import personRunning from '../../../assets/videos/man-running.json';
import Lottie from 'lottie-react-native';
import colors, {
  themeBlue,
  themeGreen,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightWhite,
  themeLightYellow,
  themeYellow,
} from '../../utils/colors';
import {ScrollView} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('screen');
const CommunityHome = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const fetchUsers = async () => {
    console.log('REQUEST SENT');
    try {
      const response = await fetch(
        'https://tame-rose-monkey-suit.cyclic.app/api/v1/auth/admin/get-users',
      );
      const users = await response.json();
      setUsers(users.users);
      console.log('DATA RECEIVED');
      setLoading(false);
    } catch (error) {
      console.log('REQUEST FAILED');
    }
  };
  useEffect(() => {
    // setLoading(true);
    fetchUsers();
  }, []);

  return (
    <TabContainer>
      {!loading ? (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.headingInfo}>Users</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.usersContainer}
            showsVerticalScrollIndicator={false}>
            {users.length > 0 &&
              users.map(user => {
                console.log(user);
                return (
                  <View style={styles.userCard}>
                    <View style={styles.userDetails}>
                      <View style={styles.firstRow}>
                        <View style={styles.profilePicContainer}>
                          <Image
                            source={{uri: user.profilePhoto}}
                            style={styles.profilePic}
                          />
                        </View>
                        <Text style={styles.userName}>
                          {user.name.length > 10
                            ? user.name.slice(0, 10) + '...'
                            : user.name}
                        </Text>
                        <View style={styles.firePoints}>
                          <View style={styles.fireIcon}>
                            <FireIcon width={30} height={30} />
                          </View>
                          <Text style={styles.firePointsText}>
                            {user.points}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.userInterests}>
                        {user.interests.length > 0 &&
                          user.interests[0].split(',').map(interest => {
                            return (
                              <View style={styles.indInterest}>
                                <Text style={styles.interestText}>
                                  {interest}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.ErrorPage}>
          <Lottie
            source={personRunning}
            autoPlay
            loop
            style={styles.animationLoadingCharacter}
          />
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.ErrorText}>Fetching Users..!</Text>
          </TouchableOpacity>
        </View>
      )}
    </TabContainer>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.themeBlack,

    gap: 20,
  },
  text: {
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
  infoContainer: {
    width: '100%',
    height: 40,
    alignItems: 'flex-start',
  },
  headingInfo: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
  usersContainer: {
    borderRadius: 20,
    padding: 20,
    gap: 20,
    transform: [{translateY: 10}],
    backgroundColor: 'black',

    width: width,
  },
  user: {
    width: '90%',
    padding: 20,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: themeBlue,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.05,
    width: '100%',
    backgroundColor: themeLightGreen,
    borderRadius: 20,
    padding: 10,
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.05,
  },
  userDetails: {},
  profilePic: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  firePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 5,
    backgroundColor: themeGrey,
    width: 75,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  fireIcon: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: themeLightYellow,
    height: '100%',
    width: '55%',
    alignItems: 'center',
  },
  firePointsText: {
    width: '45%',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  userInterests: {
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width * 0.95,
    gap: 10,
  },
  indInterest: {
    backgroundColor: themeGreen,
    padding: 10,
    borderRadius: 20,
  },
  interestText: {
    fontFamily: 'Lato-Bold',
    fontSize: 12,
    color: 'black',
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
});
