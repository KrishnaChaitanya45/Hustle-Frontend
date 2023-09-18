import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import {themeBlack, themeWhite} from '../../utils/colors';
import ChatCard from './ChatCard';
import SearchIcon from '../../../assets/icons/search.svg';
import {TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import axios from 'axios';
const {width, height} = Dimensions.get('window');
const SearchUser = ({navigation}) => {
  const friendsFromState = useSelector(state => state.user);
  console.log(friendsFromState);
  const [friends, setFriends] = React.useState(friendsFromState.friends);
  const fetchFriends = async () => {
    console.log('FRIEND REQUEST BEING SENT');
    try {
      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/${friendsFromState.user._id}`,
      );
      if (response.status == 200 || response.status == 201) {
        setFriends(response.data.users);
        console.log('=== FETCHED FRIENDS ===', response.data);
      } else {
        throw new Error('Error fetching friends');
      }
    } catch (error) {
      console.log('=== ERROR FETCHING FRIENDS ===', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);
  const filterFriends = async text => {
    setFriends(
      friends.filter(
        friend =>
          friend.name.toLowerCase().includes(text.toLowerCase()) ||
          friend.username.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };
  const debounceGetData = debounce(filterFriends, 500);
  return (
    <View style={styles.container}>
      <View style={{zIndex: 10}}>
        <Toast autoHide={false} />
      </View>
      <View style={styles.heading_container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <LeftArrow width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Text
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 18,
            fontFamily: 'Poppins-Regular',
          }}>
          Search Friend
        </Text>
        <View
          style={{
            backgroundColor: '#000',
            borderRadius: 20,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <TextInput
            placeholder="Enter the username"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={{
              backgroundColor: 'transparent',
              color: themeBlack,
              width: '80%',
              fontFamily: 'Poppins-Regular',
              fontSize: 18,
            }}
            onChange={e => {
              if (e.nativeEvent.text.length > 0) {
                // setFriends(
                //   friends.filter(item =>
                //     item.username
                //       .toLowerCase()
                //       .includes(e.nativeEvent.text.toLowerCase()),
                //   ),
                // );
                debounceGetData(e.nativeEvent.text);
              } else {
                console.log('CALLED');
                fetchFriends();
              }
            }}
          />
          <SearchIcon width={30} height={30} />
        </View>
        <ScrollView
          contentContainerStyle={{
            width: width * 0.9,
            marginLeft: -width * 0.025,
            gap: 10,
            marginTop: height * 0.05,
            paddingBottom: height * 0.025,
            // flexGrow: 1,
            // maxHeight: height * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {friends ? (
            friends.map((item, index) => (
              <View
                key={index}
                style={{
                  //   backgroundColor: '#000',
                  borderRadius: 50,
                }}
                // onPress={async () => {
                //   const response = await axios.post(
                //     `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${friendsFromState.user._id}/`,
                //     {userId: item._id},
                //   );
                //   if (response.status == 200 || response.status == 201) {
                //     navigation.navigate('ChatScreen', {
                //       // chatId: response.data.chatId,
                //       fetchedData: response.data,
                //       username: item.username,
                //       groupAdmin: undefined,
                //       chat: response.data,
                //       description: undefined,
                //       chatId: response.data._id,
                //       users: undefined,
                //       profile_image: item.profilePhoto,
                //       isGroup: false,
                //     });
                //   } else {
                //     throw new Error('Error fetching friends');
                //   }
                // }}
              >
                <ChatCard
                  username={item.username}
                  latestMessage={item.bio}
                  friend={item}
                  user={friendsFromState.user}
                  profile_image={item.profilePhoto}
                />
              </View>
            ))
          ) : (
            <View
              style={{
                width: '100%',
              }}>
              <View
                style={{
                  width: '80%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: height * 0.2,
                }}>
                <Text
                  style={{
                    color: themeWhite,
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.035,
                  }}>
                  Fetching Friends...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchUser;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: themeBlack,
    // alignItems: 'center',
  },
  heading_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    marginTop: height * 0.025,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: 10,
  },
});
