import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import RightArrow from '../../../assets/icons/right-arrow.svg';
import {themeBlack} from '../../utils/colors';
import {useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import axios from 'axios';
const {width, height} = Dimensions.get('window');
const MessageWithAttachment = ({navigation}: {navigation: any}) => {
  const router = useRoute();
  const [message, setMessage] = React.useState('');
  const user = useSelector(state => state.user.user);
  const {
    chatId,
    file,
    socket,
    setMessages,
  }: {chatId: string; file: any; socket: any} = router.params;
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
    const body = new FormData();
    body.append('message', message);
    body.append('chatId', chatId);
    const attachment = {
      uri: file.uri,
      type: file.type,
      name: file.originalName || 'attachment',
    };
    setMessage('');
    body.append('image', attachment);
    try {
      showToast(
        'Sending 🔥🚀',
        "we're sending the message to your friend",
        'info',
      );
      const response = await axios.post(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user._id}/message`,
        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('=== SENDER ===', response.data.sender);
      setMessages(messages => [...messages, response.data]);
      socket.emit('send-message', response.data);

      if (response.status == 200 || response.status == 201) {
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <KeyboardAvoidingView behavior="position">
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
        <View>
          <Image
            source={{uri: file.uri}}
            style={{
              width: width * 0.9,
              height: height * 0.5,
              resizeMode: 'contain',
              borderRadius: 20,
              alignSelf: 'center',
              marginVertical: height * 0.075,
            }}
          />
        </View>
        <View style={styles.message_container}>
          <TextInput
            placeholder="Type a message"
            textColor="#fff"
            placeholderTextColor="#fff"
            value={message}
            onChangeText={text => setMessage(text)}
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
            <TouchableOpacity onPress={sendMessage}>
              <RightArrow width={width * 0.1} height={height * 0.1} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageWithAttachment;

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'relative',
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
  message_container: {
    width: width * 0.9,
    transform: [{translateX: width * 0.05}],
    height: height * 0.1,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: height * 0.075,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
  },
});
