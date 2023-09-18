import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import EditArrow from '../../../assets/icons/edit.svg';
const ManIcon = require('../../../assets/images/Login.png');
import React, {Children, useEffect} from 'react';
import SearchIcon from '../../../assets/icons/search.svg';
import SettingsIcon from '../../../assets/icons/more.svg';
import GroupIcon from '../../../assets/icons/group.svg';
import CrossIcon from '../../../assets/icons/cross.svg';
import TabContainer from '../../components/Tab/TabContainer';
import {
  themeBlack,
  themeBlue,
  themeGreen,
  themeGrey,
  themeLightBlue,
  themeLightGreen,
  themeLightWhite,
  themePurple,
  themeRed,
  themeWhite,
} from '../../utils/colors';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import ChatCard from './ChatCard';
import {TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {addFriends} from '../../features/users/UserSlice';
import {
  addGroupChats,
  addNotifications,
  addPersonalChats,
} from '../../features/Socket/SocketSlice';
const {width, height} = Dimensions.get('window');
const data = [
  {id: Math.random().toString(), data: 'All-Chats'},
  {id: Math.random().toString(), data: 'Communities'},
  {id: Math.random().toString(), data: 'Friends'},
];
const DiaryHomePage = ({navigation}) => {
  const showToast = (text1, text2, type) => {
    Toast.show({
      text1: text1,
      text2: text2,
      type: type,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 25,
    });
  };
  const listRef = React.useRef();
  const [newGroupModalVisible, setNewGroupModalVisible] = React.useState(false);
  const [OptionSelected, setOptionSelected] = React.useState({index: 2});
  const [isGroupChat, setIsGroupChat] = React.useState(false);
  const [selectedFriends, setSelectedFriends] = React.useState([]);
  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [groupImage, setGroupImage] = React.useState(null);
  const user = useSelector(state => state.user.user);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  let socket, messagesSocket;
  const _onViewableItemsChanged = React.useCallback(
    ({viewableItems, changed}) => {
      console.log('Visible items are', viewableItems[0]);
      console.log('Changed in this iteration', changed);
      setOptionSelected(viewableItems[0]);
    },
    [],
  );
  const notifications = useSelector(state => state.socket.notifications);
  const FetchedFriends = useSelector(state => state.user.friends);
  const [friends, setFriends] = React.useState(FetchedFriends);
  const GroupChatsFetched = useSelector(state => state.socket.groupChats);
  const PersonalChatsFetched = useSelector(state => state.socket.personalChats);
  const [personalChats, setPersonalChats] =
    React.useState(PersonalChatsFetched);
  const [friendRequestsModal, setFriendRequestModal] = React.useState(false);
  const [friendRequests, setFriendRequests] = React.useState(null);
  const [groupChats, setGroupChats] = React.useState(GroupChatsFetched);
  React.useEffect(() => {
    socket = io('http://192.168.1.16:5000/users', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 2,
    });
    messagesSocket = io('http://192.168.1.16:5000/messages', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 2,
    });

    messagesSocket.emit('setup', user);
  }, []);
  const dispatch = useDispatch();

  const fetchFriendRequests = async () => {
    try {
      console.log('REQUEST SENT');
      const response = await axios.get(
        `http://192.168.1.16:5000/api/v1/user/friends/${user._id}/requests`,
      );
      console.log(response);
      if (response.status == 200 || response.status == 201) {
        setFriendRequests(response.data.friendRequests);
        console.log('=== FETCHED FRIEND REQUESTS ===', response.data);
        setFriendRequests(response.data);
      } else {
        throw new Error('Error fetching friends');
      }
    } catch (error) {
      console.log('=== ERROR FETCHING FRIENDS ===', response.data);
    }
  };

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

  React.useEffect(() => {
    console.log('=== REACHED HERE ===');
    if (friendRequestsModal) {
      fetchFriendRequests();
    }
    fetchFriends();
  }, [friendRequestsModal]);
  React.useEffect(() => {}, [newGroupModalVisible, OptionSelected]);

  const pickImage = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    if (file) {
      setGroupImage(file);
    }
  };

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});
  const createGroupHandler = async () => {
    if (selectedFriends.length < 2) {
      return;
    }
    const body = new FormData();
    body.append('chatName', groupName);
    body.append('chatDescription', groupDescription);
    if (groupImage) {
      const profileImage = {
        uri: groupImage.uri,
        type: groupImage.type,
        name: `${groupName}'s-profile-picture.jpg}`,
      };
      body.append('image', profileImage);
    }
    let users = [];
    selectedFriends.forEach(friend => {
      users.push(friend._id);
    });
    body.append('userIds', JSON.stringify(users));
    body.append('creatorId', user._id);
    try {
      console.log('request sent');

      const response = await axios.post(
        `http://192.168.1.16:5000/api/v1/chat/${user._id}/group`,

        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status == 200 || response.status == 201) {
        setNewGroupModalVisible(false);
        showToast('Hurrah...!🔥🤟', 'Group created successfully', 'success');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFriends = async () => {
    console.log('================= FETCHING FRIENDS ===================');
    try {
      const response = await axios.get(
        `http://192.168.1.16:5000/api/v1/user/friends/${user._id}`,
      );
      console.log('RESPONSE', response);
      if (response.status == 200 || response.status == 201) {
        dispatch(addFriends(response.data.friends));
        setFriends(response.data.friends);
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
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user._id}?onlyGroup=true`,
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
  const fetchOneToOneChats = async () => {
    try {
      console.log('REQUEST SENT');

      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user._id}?onlyPersonal=true`,
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
  React.useEffect(() => {
    if (socket) {
      socket.on('user-connected', data => {
        console.log('=== USER CONNECTED ===', data);
        if (data != null) {
          if (friends) {
            const findFriend = friends.find(friend => friend._id == data);
            console.log('FRIEND', findFriend);
            if (findFriend) {
              const changedFriends = JSON.parse(JSON.stringify(friends));
              changedFriends.map(friend => {
                if (friend._id == data) {
                  friend.is_online = true;
                }
              });
              setFriends(changedFriends);
              dispatch(addFriends(changedFriends));
              console.log('CHNAGED FUREDS', changedFriends);
            }
          }
          if (personalChats) {
            const personalChatUser = personalChats.find(chat => {
              return chat.users.find(user => user._id == data);
            });
            console.log('PERSONAL  CHAT USER', personalChatUser);
            if (personalChatUser) {
              const changedPersonalChats = JSON.parse(
                JSON.stringify(personalChats),
              );
              changedPersonalChats.map(chat => {
                chat.users.map(user => {
                  if (user._id == data) {
                    user.is_online = true;
                  }
                });
              });
              setPersonalChats(changedPersonalChats);
              dispatch(addPersonalChats(changedPersonalChats));
              console.log('CHANGED PERSONAL CHATS', changedPersonalChats);
            }
          }
          if (groupChats) {
            const groupChatUser = groupChats.find(chat => {
              return chat.users.find(user => user._id == data);
            });
            if (groupChatUser) {
              const changedGroupChats = JSON.parse(JSON.stringify(groupChats));
              changedGroupChats.map(chat => {
                chat.users.map(user => {
                  if (user._id == data) {
                    user.is_online = true;
                  }
                });
              });
              setGroupChats(changedGroupChats);
              dispatch(addGroupChats(changedGroupChats));
              console.log(changedGroupChats);
            }
          }
        }
      });

      socket.on('user-offline', data => {
        console.log('=== USER DISCONNECTED ===', data);
        if (data != null) {
          if (friends) {
            const findFriend = friends.find(friend => friend._id == data);
            console.log('FRIEND', findFriend);
            if (findFriend) {
              const changedFriends = JSON.parse(JSON.stringify(friends));
              changedFriends.map(friend => {
                if (friend._id == data) {
                  friend.is_online = false;
                }
              });
              setFriends(changedFriends);
              dispatch(addFriends(changedFriends));
              console.log('CHNAGED FUREDS', changedFriends);
            }
          }
          if (personalChats) {
            const personalChatUser = personalChats.find(chat => {
              return chat.users.find(user => user._id == data);
            });
            console.log('PERSONAL  CHAT USER', personalChatUser);
            if (personalChatUser) {
              const changedPersonalChats = JSON.parse(
                JSON.stringify(personalChats),
              );
              changedPersonalChats.map(chat => {
                chat.users.map(user => {
                  if (user._id == data) {
                    user.is_online = false;
                  }
                });
              });
              setPersonalChats(changedPersonalChats);
              dispatch(addPersonalChats(changedPersonalChats));
              console.log('CHANGED PERSONAL CHATS', changedPersonalChats);
            }
          }
          if (groupChats) {
            const groupChatUser = groupChats.find(chat => {
              return chat.users.find(user => user._id == data);
            });
            if (groupChatUser) {
              const changedGroupChats = JSON.parse(JSON.stringify(groupChats));
              changedGroupChats.map(chat => {
                chat.users.map(user => {
                  if (user._id == data) {
                    user.is_online = false;
                  }
                });
              });
              setGroupChats(changedGroupChats);
              dispatch(addGroupChats(changedGroupChats));
              console.log(changedGroupChats);
            }
          }
        }
      });
    }
    if (messagesSocket) {
      console.log('=== SOCKET ===', messagesSocket);

      const handleReceivedMessage = message => {
        console.log('=== MESSAGE RECEIVED ===', message);
        if (message.chatName == 'Personal Chat') fetchOneToOneChats();
        else fetchGroupChats();
        console.log(' === REACHED HERE ===');
        // This message is not for the current chat, you might want to show a notification
        if (!notifications.find(notif => notif._id == message._id)) {
          dispatch(
            addNotifications([
              {
                message: message,
                time: new Date().getTime(),
              },
              ...notifications,
            ]),
          );
        }
      };

      messagesSocket.on('message-received', handleReceivedMessage);

      // Clean up the event listener when the component unmounts
      return () => {
        messagesSocket.off('message-received');
      };
    }
  }, [socket, messagesSocket]);
  console.log('=== NOTIFICATIONS ===', notifications);
  return (
    <TabContainer>
      <View style={styles.container}>
        <View style={{zIndex: 10}}>
          <Toast autoHide={false} />
        </View>
        <View
          style={{
            width: width * 0.95,
            padding: width * 0.05,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text style={styles.upper_heading_text}>chit</Text>
            <Text style={styles.lower_heading_text}>Chat</Text>
          </View>
          <View style={styles.header_option_container}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('SearchUser')}>
              <SearchIcon width={30} height={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <SettingsIcon width={30} height={30} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Animated.FlatList
            data={data}
            ref={listRef}
            keyExtractor={item => item.id}
            horizontal
            // onScrollBeginDrag={() => {}}
            // onScrollEndDrag={() => {
            //   console.log(listRef.current);
            // }}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={_onViewableItemsChanged}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: width * 0.95,
                  marginLeft: width * 0.05,

                  // marginRight: width * 0.025,
                  overflow: 'hidden',
                }}>
                <View style={styles.list_container}>
                  <View
                    style={{
                      width: width * 0.9,
                      overflow: 'hidden',
                    }}>
                    {OptionSelected.index == 1 && (
                      <View
                        style={{
                          width: width * 0.9,
                          flexDirection: 'row',
                          gap: 10,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            borderColor: `rgba(255,255,255,0.25)`,
                            borderRadius: 100,
                            gap: 10,
                            padding: 10,
                          }}
                          onPress={() => {
                            setNewGroupModalVisible(true);
                          }}>
                          {/* <View
                          style={{
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: themeBlue,
                          }}>
                          <GroupIcon
                            width={width * 0.075}
                            height={width * 0.075}
                          />
                        </View> */}
                          <Text
                            style={{
                              color: themeWhite,
                              fontFamily: 'Poppins-Medium',
                              fontSize: 14,
                              textAlign: 'center',
                            }}>
                            New Community
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            flex: 1.1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            backgroundColor: themeBlue,
                            borderColor: `rgba(255,255,255,0.25)`,
                            borderRadius: 100,
                            gap: 10,
                            padding: 10,
                          }}>
                          {/* <View
                          style={{
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: themeBlue,
                          }}>
                          <GroupIcon
                            width={width * 0.075}
                            height={width * 0.075}
                          />
                        </View> */}
                          <Text
                            style={{
                              color: themeWhite,
                              fontFamily: 'Poppins-Medium',
                              fontSize: 14,
                              textAlign: 'center',
                            }}>
                            Explore Communities
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {OptionSelected.index == 2 && (
                      <View
                        style={{
                          width: width * 0.9,
                          flexDirection: 'row',
                          gap: 10,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            flex: 1.1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            backgroundColor: themeBlue,
                            borderColor: `rgba(255,255,255,0.25)`,
                            borderRadius: 100,
                            gap: 10,
                            padding: 10,
                          }}
                          onPress={() => {
                            setFriendRequestModal(true);
                          }}>
                          {/* <View
                          style={{
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: themeBlue,
                          }}>
                          <GroupIcon
                            width={width * 0.075}
                            height={width * 0.075}
                          />
                        </View> */}
                          <Text
                            style={{
                              color: themeWhite,
                              fontFamily: 'Poppins-Medium',
                              fontSize: 14,
                              textAlign: 'center',
                            }}>
                            Friend Requests
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <ScrollView
                      contentContainerStyle={{
                        width: '100%',
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 20,
                        backgroundColor: '#000',

                        alignItems: 'center',
                      }}
                      showsVerticalScrollIndicator={false}
                      bounces={false}>
                      {OptionSelected.index == 1 &&
                      groupChats &&
                      groupChats.length > 0
                        ? groupChats.map((item, index) => {
                            console.log('REACHED HERE');

                            console.log('LATEST MESSAGE', item.latestMessage);
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('ChatScreen', {
                                    profile_image: item.groupIcon,
                                    username: item.chatName,
                                    chatId: item._id,
                                    chat: item,
                                    users: item.users,
                                    description: item.chatDescription,
                                    background: item.chatBackground,
                                    groupAdmin: item.groupAdmin,
                                    isGroup: true,
                                  });
                                }}
                                style={{
                                  width: '100%',
                                }}>
                                <ChatCard
                                  latestMessage={
                                    item.latestMessage &&
                                    item.latestMessage.message
                                      ? item.latestMessage.message
                                      : item.latestMessage &&
                                        item.latestMessage.media
                                      ? 'Image'
                                      : 'No New Messages'
                                  }
                                  username={item.chatName}
                                  notification={notifications.find(
                                    notification =>
                                      notification.message.chat._id == item._id,
                                  )}
                                  sentBy={
                                    item.latestMessage &&
                                    item.latestMessage.sender
                                  }
                                  profile_image={item.groupIcon}
                                  key={index}
                                />
                              </TouchableOpacity>
                            );
                          })
                        : OptionSelected.index == 1 && (
                            <View>
                              <Text
                                style={{
                                  color: themeWhite,
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 14,
                                  textAlign: 'center',
                                }}>
                                No Communities
                              </Text>
                            </View>
                          )}
                      {OptionSelected.index == 0 &&
                      personalChats &&
                      personalChats.length > 0
                        ? personalChats.map((item, index) => {
                            console.log('REACHED HERE', item);
                            console.log(
                              'LATEST MESSAGE FROM FRIENDS',
                              item.latestMessage,
                            );
                            let latestMessageRecieved =
                              item.latestMessage.message;
                            const thisChatMessages = notifications.filter(
                              notification =>
                                notification.message.chat._id == item._id,
                            );
                            if (thisChatMessages.length > 0) {
                              latestMessageRecieved =
                                thisChatMessages[0].message.message;
                            }
                            {
                              notifications.length > 1 &&
                                console.log(notifications[0].message.chat._id);
                            }
                            console.log(item);
                            console.log('NOTIFICATIONS', notifications);
                            console.log('THIS CHAT MESSAGES', thisChatMessages);
                            return (
                              <TouchableOpacity
                                onPress={async () => {
                                  const filteredNotifications =
                                    notifications.filter(
                                      notification =>
                                        notification.message.chat._id !=
                                        item._id,
                                    );
                                  dispatch(
                                    addNotifications(filteredNotifications),
                                  );
                                  navigation.navigate('ChatScreen', {
                                    chatId: item._id,
                                    // fetchedData: response.data,
                                    username: item.users.find(
                                      u => u._id != user._id,
                                    ).username,
                                    groupAdmin: undefined,
                                    chat: item,
                                    description: undefined,
                                    isOnline: item.users.find(
                                      u => u._id != user._id,
                                    ).is_online,
                                    users: undefined,
                                    profile_image: item.users.find(
                                      u => u._id != user._id,
                                    ).profilePhoto,
                                    isGroup: false,
                                  });
                                }}
                                style={{
                                  width: '100%',
                                }}>
                                <ChatCard
                                  latestMessage={
                                    item.latestMessage && latestMessageRecieved
                                      ? latestMessageRecieved
                                      : 'No New Messages'
                                  }
                                  username={
                                    item.users.find(u => u._id != user._id)
                                      .username
                                  }
                                  notification={
                                    thisChatMessages &&
                                    thisChatMessages.length > 0
                                      ? thisChatMessages
                                      : null
                                  }
                                  isOnline={
                                    item.users.find(u => u._id != user._id)
                                      .is_online ||
                                    (thisChatMessages &&
                                    thisChatMessages.length > 0
                                      ? true
                                      : false)
                                  }
                                  profile_image={
                                    item.users.find(u => u._id != user._id)
                                      .profilePhoto
                                  }
                                  key={index}
                                />
                              </TouchableOpacity>
                            );
                          })
                        : OptionSelected.index == 0 && (
                            <View>
                              <Text
                                style={{
                                  color: themeWhite,
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 14,
                                  textAlign: 'center',
                                }}>
                                No Personal Chats
                              </Text>
                            </View>
                          )}
                      {OptionSelected.index == 2 &&
                      friends &&
                      friends.length > 0
                        ? friends.map((item, index) => {
                            console.log('REACHED HERE');
                            console.log('LATEST MESSAGE', item.latestMessage);
                            return (
                              <TouchableOpacity
                                onPress={async () => {
                                  const response = await axios.post(
                                    `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user._id}/`,
                                    {userId: item._id},
                                  );
                                  console.log(response);
                                  if (
                                    response.status == 200 ||
                                    response.status == 201
                                  ) {
                                    navigation.navigate('ChatScreen', {
                                      // chatId: response.data.chatId,
                                      fetchedData: response.data,

                                      username: item.username,
                                      groupAdmin: undefined,
                                      chat: response.data,
                                      description: undefined,
                                      chatId: response.data._id,
                                      users: response.data.users,
                                      profile_image: item.profilePhoto,
                                      isGroup: false,
                                    });
                                  } else {
                                    throw new Error('Error fetching friends');
                                  }
                                }}
                                style={{
                                  width: '100%',
                                }}>
                                <ChatCard
                                  latestMessage={item.bio}
                                  username={item.username}
                                  isOnline={item.is_online}
                                  profile_image={item.profilePhoto}
                                  key={index}
                                />
                              </TouchableOpacity>
                            );
                          })
                        : OptionSelected.index == 2 && (
                            <View>
                              <Text
                                style={{
                                  color: themeWhite,
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 14,
                                  textAlign: 'center',
                                }}>
                                No Friends
                              </Text>
                            </View>
                          )}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}
            pagingEnabled
          />
        </View>
        <View style={styles.menu_container}>
          <View style={styles.option_container}>
            {data &&
              data.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.indOption,
                    {
                      backgroundColor:
                        OptionSelected.index === index ? themePurple : '#000',
                    },
                  ]}
                  onPress={() => {
                    listRef.current.scrollToIndex({
                      index: index,
                      animated: true,
                    });
                    setOptionSelected({index: index});
                  }}>
                  <Text
                    style={[
                      styles.option_text,
                      {
                        color:
                          OptionSelected.index === index
                            ? themeWhite
                            : themeGrey,
                      },
                    ]}>
                    {item.data}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <Modal animationType="slide" visible={newGroupModalVisible} transparent>
          <View style={styles.new_group_modal}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: '5%',
                alignItems: 'center',
              }}>
              <Text style={styles.new_group_modal_text}>New Community</Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: themeBlack,
                }}
                onPress={() => {
                  setNewGroupModalVisible(false);
                }}>
                <CrossIcon width={30} height={30} />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                width: width * 0.9,
                padding: '5%',
                gap: height * 0.05,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
              bounces={false}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeBlue,
                  borderRadius: 100,
                  // width: '100%',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <Image
                  source={groupImage || ManIcon}
                  style={{
                    width: width * 0.5,
                    borderRadius: 100,
                    height: height * 0.25,
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 0,
                    backgroundColor: '#000',
                    padding: 10,
                    borderRadius: 100,
                  }}
                  onPress={pickImage}>
                  <EditArrow width={30} height={30} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 10,
                }}>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.035,
                  }}>
                  Community Name
                </Text>
                <TextInput
                  placeholder="Enter The Name Of The Community"
                  placeholderTextColor={themeGrey}
                  textColor={themeWhite}
                  onChange={e => {
                    setGroupName(e.nativeEvent.text);
                  }}
                  value={groupName}
                  style={{
                    width: '90%',
                    borderTopRightEndRadius: 20,
                    borderTopLeftEndRadius: 20,
                    borderBottomRightEndRadius: 20,
                    borderBottomLeftEndRadius: 20,
                    backgroundColor: themeBlack,
                    color: themeWhite,
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.04,
                  }}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 10,
                }}>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.035,
                  }}>
                  Community Description
                </Text>
                <TextInput
                  placeholder="Enter The Description"
                  placeholderTextColor={themeGrey}
                  textColor={themeWhite}
                  onChange={e => {
                    setGroupDescription(e.nativeEvent.text);
                  }}
                  value={groupDescription}
                  style={{
                    width: '90%',
                    borderTopRightEndRadius: 20,
                    borderTopLeftEndRadius: 20,
                    borderBottomRightEndRadius: 20,
                    borderBottomLeftEndRadius: 20,
                    backgroundColor: themeBlack,
                    color: themeWhite,
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.04,
                  }}
                />
              </View>
              <ScrollView
                contentContainerStyle={{
                  width: width * 0.9,
                  gap: 10,
                  paddingBottom: height * 0.25,
                  // flexGrow: 1,
                  // maxHeight: height * 0.2,
                  alignItems: 'center',

                  justifyContent: 'center',
                }}
                bounces={false}>
                <ScrollView
                  contentContainerStyle={{
                    padding: 10,
                    // width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: width * 0.05,
                  }}>
                  {selectedFriends.length > 0
                    ? selectedFriends.map((item, index) => {
                        return (
                          <View
                            style={{
                              borderWidth: 2,
                              borderColor: themePurple,
                              borderRadius: 100,
                              position: 'relative',
                            }}
                            key={index}>
                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                top: -10,
                                borderRadius: 100,
                                paddingHorizontal: 10,
                                zIndex: 1,
                                paddingVertical: 1.5,
                                backgroundColor: themeRed,
                                right: -10,
                              }}
                              onPress={() => {
                                setSelectedFriends(prev =>
                                  prev.filter(item2 => item2._id !== item._id),
                                );
                              }}>
                              <Text
                                style={{
                                  color: themeWhite,
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 16,
                                }}>
                                x
                              </Text>
                            </TouchableOpacity>
                            <Image
                              source={
                                item.profilePhoto
                                  ? {uri: item.profilePhoto}
                                  : ManIcon
                              }
                              style={{
                                width: width * 0.175,
                                height: height * 0.1,
                                borderRadius: 100,
                              }}
                            />
                          </View>
                        );
                      })
                    : null}
                </ScrollView>
                <View
                  style={{
                    width: '100%',
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'Poppins-Medium',
                      fontSize: width * 0.035,
                    }}>
                    Add Friends
                  </Text>
                  <TextInput
                    placeholder="Search Friends"
                    placeholderTextColor={themeGrey}
                    textColor={themeWhite}
                    style={{
                      width: '90%',
                      borderTopRightEndRadius: 20,
                      borderTopLeftEndRadius: 20,
                      borderBottomRightEndRadius: 20,
                      borderBottomLeftEndRadius: 20,
                      backgroundColor: themeBlack,
                      color: themeWhite,
                      fontFamily: 'Poppins-Medium',
                      fontSize: width * 0.04,
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
                        fetchFriends();
                      }
                    }}
                  />
                </View>
                <ScrollView
                  contentContainerStyle={{
                    width: width * 0.9,
                    gap: 10,
                    paddingBottom: height * 0.025,
                    // flexGrow: 1,
                    // maxHeight: height * 0.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {friends ? (
                    friends.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (
                            selectedFriends.find(
                              item2 => item2._id === item._id,
                            )
                          )
                            return;
                          setSelectedFriends(prev => [...prev, item]);
                        }}>
                        <ChatCard
                          username={item.username}
                          latestMessage={item.bio}
                          profile_image={item.profilePhoto}
                        />
                      </TouchableOpacity>
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
                <View
                  style={{
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: height * 0.1,
                    marginLeft: -width * 0.1,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      opacity: selectedFriends.length >= 2 ? 1 : 0.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: themePurple,
                      paddingVertical: 10,
                      borderRadius: 100,
                    }}
                    onPress={createGroupHandler}>
                    <Text
                      style={{
                        color: themeWhite,
                        fontFamily: 'Poppins-Medium',
                        fontSize: width * 0.04,
                        textAlign: 'center',
                      }}>
                      Create Group
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </Modal>
        <Modal animationType="slide" visible={friendRequestsModal} transparent>
          <View style={styles.new_group_modal}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: '5%',
                alignItems: 'center',
              }}>
              <Text style={styles.new_group_modal_text}>Friend Requests</Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: themeBlack,
                }}
                onPress={() => {
                  setFriendRequestModal(false);
                }}>
                <CrossIcon width={30} height={30} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {friendRequests &&
                friendRequests.friendRequests &&
                friendRequests.friendRequests.length > 0 &&
                friendRequests.friendRequests.map((item, index) => {
                  return (
                    <ChatCard
                      latestMessage="Friend Request"
                      username={item.from.username}
                      profile_image={item.from.profilePhoto}
                      key={index}
                      setFriendRequestModal={setFriendRequestModal}
                      isFriendRequest={item._id}
                      user={user.user}
                    />
                  );
                })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </TabContainer>
  );
};

export default DiaryHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: themeBlack,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
  upper_heading_text: {
    fontSize: 16,
    fontFamily: 'Lato-Medium',
    color: themePurple,
  },
  lower_heading_text: {
    fontSize: 26,
    marginTop: -10,
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    color: themeWhite,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#000',
  },
  header_option_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: width * 0.025,
  },
  list_container: {
    width: width * 0.9,
    // marginRight: width * 0.5,
    marginTop: height * 0.125,
    // height: height,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  menu_container: {
    width: width * 0.9,
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.13,
  },
  option_container: {
    width: '100%',
    height: height * 0.1,
    backgroundColor: '#000',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indOption: {
    width: '33%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  option_text: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: themeGrey,
  },
  new_group_modal: {
    width: width,
    height: height / 1.25,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    padding: 20,
    alignItems: 'center',
    borderTopRightRadius: 40,
  },
  new_group_modal_text: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: themeWhite,
  },
});
