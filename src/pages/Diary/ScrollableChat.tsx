import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Animated,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import ScrollableFeed from 'react-scrollable-feed';
import {isLastMessage, isSameSender} from '../../utils/messages/ChatLogic';
import {FlatList, TouchableOpacity} from 'react-native';
import {themeBlack, themeBlue, themeGreen, themeGrey} from '../../utils/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {io} from 'socket.io-client';
const ManIcon = require('../../../assets/images/Login.png');
const {width, height} = Dimensions.get('window');
let socket;
const MessageComponent = ({
  message,
  otherArgs,
}: {
  message: string;
  otherArgs: any;
}) => {
  const user = otherArgs.user;
  const messages = otherArgs.messages;
  const index = otherArgs.index;
  const setImageClicked = otherArgs.setImageSelected;
  // console.log('=== MESSAGE ===', message);

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '90%',
        padding: '5%',
        marginHorizontal: '5%',
        zIndex: -1,
        gap: -10,
        position: 'relative',
        justifyContent:
          message.sender._id === user._id ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
      }}
      key={index}>
      {message.sender._id !== user._id && (
        <TouchableOpacity>
          <Image
            source={
              message.sender.profilePhoto
                ? {uri: message.sender.profilePhoto}
                : ManIcon
            }
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              bottom: -15,
              left: -15,
              backgroundColor: themeBlack,
              zIndex: 10,
              borderRadius: 100,
              borderColor: '#fff',
            }}
          />
        </TouchableOpacity>
      )}
      <View
        style={{
          backgroundColor:
            message.sender._id === user._id ? themeBlue : themeGrey,
          padding: 10,
          zIndex: -1,
          borderRadius: 10,

          maxWidth: '80%',
          gap: 5,
        }}>
        {message.media && (
          <TouchableOpacity
            onPress={() => {
              setImageClicked(message.media);
            }}>
            <Image
              source={{uri: message.media}}
              style={{
                width: width * 0.5,
                height: height * 0.3,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Poppins-Regular',
          }}>
          {message.message}
        </Text>
      </View>

      {message.sender._id === user._id && (
        <TouchableOpacity>
          <Image
            source={
              message.sender.profilePhoto
                ? {uri: message.sender.profilePhoto}
                : ManIcon
            }
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              bottom: -10,

              borderRadius: 100,
              borderColor: '#fff',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const ScrollableChat = ({messages}: {messages: any}) => {
  const user = useSelector((state: any) => state.user.user);
  const [imageSelected, setImageSelected] = React.useState(null);
  const messagesRef = useRef(null);
  useEffect(() => {
    messagesRef.current.scrollToEnd({animated: true});
  }, [messages]);
  // useEffect(() => {
  //   socket = io('https://tame-rose-monkey-suit.cyclic.app', {
  //     transports: ['websocket'],
  //     reconnection: true,

  //     reconnectionAttempts: 2,
  //   });
  //   socket.on('connect', () => {
  //     console.log('connected');
  //   });
  //   socket.emit('setup', user._id);
  //   socket.emit('join-chat', messages[0].chat._id);
  // }, []);
  // useEffect(() => {
  //   console.log('== SOCKET ===', socket);
  //   socket.on('message-received', message => {
  //     console.log('message received');
  //   });
  // });
  return (
    <View
      style={{
        paddingBottom: height * 0.15,
      }}>
      <Animated.FlatList
        data={messages}
        ref={messagesRef}
        renderItem={({item, index}) => (
          <MessageComponent
            message={item}
            otherArgs={{messages, user, index, setImageSelected}}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* {messages.map((message: any, index: number) => {
        console.log(isSameSender(messages, message, index, user._id));
        return (
        
        );
      })} */}
      <Modal visible={Boolean(imageSelected)} animationType="slide" transparent>
        <View
          style={{
            height: height,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            backgroundColor: '#000',
          }}>
          <View style={styles.heading_container}>
            <TouchableOpacity
              onPress={() => {
                setImageSelected(null);
              }}>
              <LeftArrow width={40} height={40} />
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: imageSelected}}
            style={{
              width: width * 0.95,
              height: height * 0.95,
              zIndex: -1,
              borderRadius: 20,
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ScrollableChat;

const styles = StyleSheet.create({
  heading_container: {
    flexDirection: 'row',
    top: height * 0.0125,
    left: width * 0.0125,
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    padding: 20,
  },
});
