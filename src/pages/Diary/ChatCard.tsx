import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
const ManIcon = require('../../../assets/images/Login.png');
import {themeGreen, themeGrey, themeRed, themeWhite} from '../../utils/colors';
const {width, height} = Dimensions.get('window');
import {IconOutline} from '@ant-design/icons-react-native';
import {Icon} from 'react-native-paper/lib/typescript/src/components/Avatar/Avatar';
import axios from 'axios';
import moment from 'moment';
import {useSelector} from 'react-redux';

const ChatOption = ({
  profile_image,
  username,
  latestMessage,
  user,
  friend,
  notification,
  sentBy,
  isOnline,
  setFriendRequestModal,
  isFriendRequest,
}: {
  profile_image: string;
  username: string;
  user?: any;
  setFriendRequestModal: any;
  isFriendRequest?: any;
  friend?: any;
  isOnline?: Boolean;
  latestMessage: string;
  notification?: any | undefined;
  sentBy?: any;
}) => {
  console.log(sentBy);
  console.log(user);
  const isFriend =
    user && friend && Boolean(user.friends.find(u => u == friend._id));
  console.log('== IS FRIEND ==', isFriend);
  const userData = useSelector((state: any) => state.user.user);
  console.log('=== USER DATA ==', userData._id);
  console.log("=== FRIEND'S ID ===", friend?._id);
  const sendFriendRequest = async () => {
    try {
      const response = await axios.post(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/friends/${userData._id}`,
        {
          friendId: friend._id,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log('REQUEST FAILED', error);
    }
  };
  const acceptOrRejectRequest = async (acceptOrReject: Boolean) => {
    console.log(isFriendRequest);
    try {
      const response = await fetch(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/friends/${userData._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId: isFriendRequest,
            DidTheReceiverAccept: acceptOrReject,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
      setFriendRequestModal(false);
    } catch (error) {
      console.log('REQUEST FAILED', error);
    }
  };
  return (
    <View style={styles.profile_container}>
      <View style={styles.profile_image_container}>
        <Image
          source={profile_image ? {uri: profile_image} : ManIcon || ManIcon}
          style={{
            width: width * 0.175,
            height: width * 0.175,
            borderRadius: 100,
          }}
        />
        {isOnline != undefined && (
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              width: 20,
              height: 20,
              borderRadius: 100,
              backgroundColor: isOnline ? themeGreen : themeRed,
            }}></View>
        )}
      </View>
      <View
        style={{
          gap: width * 0.0125,
          maxWidth: width * 0.4,
        }}>
        <Text
          style={{
            color: themeWhite,
            fontFamily: 'Poppins-Medium',
            fontSize: width * 0.05,
          }}>
          {username || 'Krishna'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: width * 0.05,
          }}>
          {sentBy && (
            <Image
              source={{uri: sentBy.profilePhoto}}
              style={{width: 20, height: 20, borderRadius: 100}}
            />
          )}
          <Text
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: width * 0.035,
              fontFamily: 'Poppins-Regular',
            }}>
            {latestMessage.length > 15
              ? latestMessage.slice(0, 15) + '...'
              : latestMessage || 'Hey hi..'}
          </Text>
        </View>
      </View>
      {isFriend !== undefined && isFriend == false && (
        <View
          style={{
            marginLeft: 20,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: 10,
              borderRadius: 100,
            }}
            onPress={sendFriendRequest}>
            <Text
              style={{
                color: themeWhite,
              }}>
              Add
            </Text>
          </TouchableOpacity>
          {/* <UserAddOutlined style={{color: themeWhite, fontSize: 20}} /> */}
        </View>
      )}
      {notification && (
        <View
          style={{
            marginLeft: 20,
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: width * 0.05,
          }}>
          <View>
            <Text style={{color: themeGreen, fontSize: 10}}>
              {moment(notification[0].message.createdAt).format('hh:mm A')}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: themeGreen,
                fontSize: 12,
                backgroundColor: themeGrey,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 100,
              }}>
              {notification.length}
            </Text>
          </View>
        </View>
      )}
      {Boolean(isFriendRequest) && (
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: width * 0.025,
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 100,
            }}
            onPress={() => {
              acceptOrRejectRequest(true);
            }}>
            <Text>Y</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 100,
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
            onPress={() => {
              acceptOrRejectRequest(false);
            }}>
            <Text>N</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChatOption;

const styles = StyleSheet.create({
  profile_container: {
    width: width * 0.9,
    padding: 5,
    gap: width * 0.075,
    // marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    // justifyContent: 'space-around',
    flexDirection: 'row',
  },
  profile_image_container: {
    padding: 5,
    position: 'relative',
    borderRadius: 100,
    // backgroundColor: themePurple,
  },
});
