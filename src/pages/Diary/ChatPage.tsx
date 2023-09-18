import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import React, {useEffect} from 'react';
import axios from 'axios';
//@ts-ignore
import LoadingAnimation from '../../../assets/videos/animation_lm0fqigv.json';
import LottiePlayer from 'lottie-react-native';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import CallIcon from '../../../assets/icons/call.svg';
import OptionsIcon from '../../../assets/icons/more.svg';
const Typing = require('../../../assets/icons/typing.json');
import RightArrow from '../../../assets/icons/right-arrow (3).svg';
import Attachment from '../../../assets/icons/attachment.svg';
import VideoCallIcon from '../../../assets/icons/video-camera.svg';
const ManIcon = require('../../../assets/images/Login.png');
import {
  themeBlack,
  themeGreen,
  themePurple,
  themeWhite,
} from '../../utils/colors';
import Lottie from 'lottie-react-native';
import {io} from 'socket.io-client';
import {TextInput} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import ScrollableChat from './ScrollableChat';
import {set} from 'react-native-reanimated';
import {addNotifications} from '../../features/Socket/SocketSlice';
const {width, height} = Dimensions.get('window');
let socket;
const ChatPage = ({navigation}: {navigation: any}) => {
  const router = useRoute();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState(null);
  const [atttachment, setAttachment] = React.useState(null);
  const [typing, setTyping] = React.useState(false);
  const [loadingChats, setLoadingChats] = React.useState(false);
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const {
    username,
    groupAdmin,
    description,
    chat,
    chatId,
    isOnline,
    users,
    profile_image,
    isGroup,
  }: {username: String; profile_image: String; isGroup: boolean} =
    router.params;
  const notifications = useSelector(state => state.socket.notifications);
  console.log('CHAT', chat);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoadingChats(true);
    socket = io('http://192.168.1.16:5000/messages', {
      transports: ['websocket'],
      reconnection: true,
      rejectUnauthorized: false,
      reconnectionAttempts: Infinity,
    });

    // socket.on('connect_error', err => {
    //   console.log(`connect_error due to ${err.message}`, err);
    // });
    // socket.on('disconnect', reason => {
    //   if (reason === 'io server disconnect') {
    //     // the disconnection was initiated by the server, you need to reconnect manually
    //     socket.connect();
    //   }
    //   // else the socket will automatically try to reconnect
    // });
    // socket.connect();
    // socket.on('ping', () => {
    //   console.log('ping');
    // });
    // socket.on('pong', ms => {
    //   console.log(`pong: ${ms}ms`);
    // });
    // socket.on('reconnection_attempt', () => {
    //   socket.io.opts.transports = ['polling', 'websocket'];
    //   console.log('reconnection_attempt');
    // });
    socket.on('connect', () => {
      setSocketConnected(true);
    });
    socket.emit('setup', user);
    socket.on('typing', sender => {
      if (sender._id == user._id) return;

      setIsTyping(sender);
    });
    socket.on('stop-typing', sender => {
      // if (sender == user._id) return;
      setIsTyping(false);
    });
    socket.emit('join-chat', chatId);
    // setSocket(socket);
    fetchMessages();
    setLoadingChats(false);
  }, []);

  const typingHandler = e => {
    setMessage(e);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', chatId, chat, user);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1500;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop-typing', chatId, chat, user);
        setTyping(false);
      }
    }, timerLength);
  };
  const pickImage = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    if (file) {
      setAttachment(file);
      navigation.navigate('message-with-attachment', {
        chatId,
        file,
        setMessages,
        socket,
      });
    }
  };
  console.log('username', username);
  const user = useSelector(state => state.user.user);
  const fetchMessages = async () => {
    setLoadingChats(true);
    try {
      console.log('REQUEST SENT');
      const response = await axios.get(
        `http://192.168.1.16:5000/api/v1/chat/${user._id}/message/${chatId}`,
      );
      console.log('=== FETCHED MESSAGES ===', response.data);
      setMessages(response.data);
    } catch (error) {
      console.log('=== ERROR FETCHING MESSAGES ===', error);
    }
  };
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
  const sendMessage = async () => {
    if (message.length < 1) return;
    try {
      setMessage('');
      socket.emit('stop-typing', chatId, chat, user);
      showToast(
        'Sending 🔥🚀',
        "we're sending the message to your friend",
        'info',
      );
      const response = await axios.post(
        `http://192.168.1.16:5000/api/v1/chat/${user._id}/message`,
        {chatId, message},
      );
      console.log(response.data);
      // console.log(' === SOCKET ===', socket);
      setMessages(prev => [...prev, response.data.message]);
      socket.emit('send-message', response.data.message);
      if (response.status == 200 || response.status == 201) {
        console.log('REQUEST SUCCESSFULLY SENT', response.data);
      } else {
        throw new Error('Error sending message');
      }
    } catch (error) {
      console.log('=== ERROR SENDING MESSAGE ===', error);
      showToast(
        'Error 🥺',
        'There was an issue from our side while sending..!',
        'error',
      );
    }
  };

  console.log('=== IS ONLINE ===', isOnline);
  console.log('=== IS LOADING', loadingChats);
  useEffect(() => {
    console.log('=== SOCKET ===', socket);

    const handleReceivedMessage = message => {
      console.log('=== MESSAGE RECEIVED ===', message);

      if (message.chat._id !== chatId) {
        console.log(' === REACHED HERE ===');
        // This message is not for the current chat, you might want to show a notification
        if (!notifications.find(notif => notif._id == message._id)) {
          dispatch(
            addNotifications([
              ...notifications,
              {
                message: message,
                time: new Date().getTime(),
              },
            ]),
          );
          fetchMessages();
        }
      } else {
        // Check if the message already exists in the state
        try {
          if (!messages.find(msg => msg._id === message._id)) {
            setMessages(prevMessages => [...prevMessages, message]);
          }
        } catch (error) {
          console.log('ERROR');
        }
      }
    };

    socket.on('message-received', handleReceivedMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('message-received');
    };
  }, [socket, chatId, messages]);
  console.log();
  return (
    <View>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
          <View style={{zIndex: 10}}>
            <Toast autoHide={false} />
          </View>
          <ImageBackground
            source={{uri: chat.chatBackground}}
            style={{
              width: width,
              height: height,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          <View style={styles.details_container}>
            <View style={styles.back_userdet}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Pressed');
                  navigation.goBack();
                }}>
                <LeftArrow width={35} height={35} />
              </TouchableOpacity>
              <View style={styles.profile_image_container}>
                <Image
                  source={
                    profile_image ? {uri: profile_image} : ManIcon || ManIcon
                  }
                  style={{
                    width: width * 0.15,
                    height: width * 0.15,
                    borderRadius: 100,
                  }}
                />
                {!isGroup && isOnline && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: themeGreen,
                      borderRadius: 100,
                      width: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                )}
              </View>
              <View>
                <Text
                  style={{
                    color: themeWhite,
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.04,
                  }}>
                  {username || 'Krishna'}
                </Text>
              </View>
            </View>
            {isGroup ? (
              <View>
                <TouchableOpacity
                  style={{
                    // marginLeft: width * 0.75,
                    flexDirection: 'row',
                    backgroundColor: '#000',
                    borderRadius: 100,
                    padding: 10,
                    gap: width * 0.075,
                  }}
                  onPress={() => {
                    console.log("I'm pressed");
                    navigation.navigate('group-chat-edit', {
                      users: users,
                      groupAdmin: groupAdmin,
                      description: description,
                      chatId: chatId,
                      groupName: username,
                      groupIcon: profile_image,
                    });
                  }}>
                  <OptionsIcon width={30} height={30} />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  gap: width * 0.075,
                }}>
                <CallIcon width={30} height={30} />
                <VideoCallIcon width={30} height={30} />
              </View>
            )}
          </View>
          <View
            style={{
              paddingBottom: height * 0.2,
            }}>
            {!loadingChats && (messages && messages.length) > 0 ? (
              <ScrollableChat messages={messages} />
            ) : loadingChats ? (
              <View
                style={{
                  width: width,
                  height: height * 0.7,
                  alignItems: 'center',
                  justifyContent: 'center',

                  backgroundColor: themeBlack,
                }}>
                <LottiePlayer
                  source={LoadingAnimation}
                  autoPlay
                  loop
                  style={{
                    width: width * 0.5,
                    height: width * 0.5,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: width,
                  height: height * 0.7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    backgroundColor: themeBlack,
                    padding: 20,
                    borderRadius: 12,
                    color: themeWhite,
                    fontFamily: 'Poppins-Medium',
                    fontSize: width * 0.04,
                  }}>
                  No messages yet
                </Text>
              </View>
            )}
            {isTyping ? (
              <View
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  bottom: height * 0.275,
                  left: width * 0.05,
                }}>
                <Image
                  source={
                    isTyping.profilePhoto
                      ? {uri: isTyping.profilePhoto}
                      : ManIcon
                  }
                  style={{
                    width: width * 0.1,
                    height: width * 0.1,
                  }}
                />
                <Lottie
                  source={Typing}
                  autoPlay
                  loop
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                  }}
                />
              </View>
            ) : null}
          </View>
          {/* </ScrollView> */}
        </View>
        <View style={styles.message_container}>
          <TextInput
            placeholder="Type a message"
            textColor="#fff"
            value={message}
            onChangeText={typingHandler}
            placeholderTextColor="#fff"
            style={{
              width: '70%',
              backgroundColor: 'transparent',
              padding: 5,
              fontFamily: 'Poppins-Regular',
            }}></TextInput>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: width * 0.05,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={pickImage}>
              <Attachment width={width * 0.075} height={height * 0.075} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendMessage}>
              <RightArrow width={width * 0.1} height={height * 0.1} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'relative',
    backgroundColor: themeBlack,
  },
  details_container: {
    width: width * 0.95,
    padding: 10,

    marginTop: height * 0.025,
    // marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  profile_image_container: {
    position: 'relative',
  },
  back_userdet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.05,
    justifyContent: 'space-around',
  },
  message_container: {
    width: width * 0.9,
    transform: [{translateX: width * 0.05}],
    height: height * 0.1,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
  },
});
