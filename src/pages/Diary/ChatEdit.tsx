import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ChatCard from './ChatCard';
import Toast from 'react-native-toast-message';
import LeftArrow from '../../../assets/icons/left-arrow.svg';
import EditArrow from '../../../assets/icons/edit.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import {
  themeBlack,
  themeBlue,
  themeGrey,
  themeRed,
  themeWhite,
  themeYellow,
} from '../../utils/colors';
import Logout from '../../../assets/icons/logout.svg';
import {TextInput} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
const ManIcon = require('../../../assets/images/Login.png');
const {width, height} = Dimensions.get('window');
const ChatEdit = ({navigation}: {navigation: any}) => {
  const router = useRoute();
  const [addToGroup, setAddToGroup] = React.useState(false);
  const {groupName, description, groupAdmin, chatId, groupIcon, users} =
    router.params;
  console.log(groupIcon);
  const [group_icon, setGroupIcon] = React.useState(groupIcon);
  const [group_name, setGroupName] = React.useState(groupName);
  const [friends, setFriends] = React.useState(null);
  const [selectedFriends, setSelectedFriends] = React.useState(users);
  const [group_description, setGroupDescription] = React.useState(description);
  const user = useSelector((state: any) => state.user);
  const pickImage = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);
    const file = result.assets[0];
    if (file) {
      setGroupIcon(file);
    }
  };
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/user/friends/${user.user._id}`,
      );
      if (response.status == 200 || response.status == 201) {
        setFriends(response.data.friends);
        console.log('=== FETCHED FRIENDS ===', response.data);
      } else {
        throw new Error('Error fetching friends');
      }
    } catch (error) {
      console.log('=== ERROR FETCHING FRIENDS ===', error);
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
  const changeGroupDetails = async (
    name: String | undefined,
    description: String | undefined,
  ) => {
    try {
      console.log('request sent');
      const response = await axios.put(
        `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${chatId}/group-rename`,
        {
          chatName: group_name,
          chatId: chatId,
          chatDescription: group_description,
        },
      );
      if (response.status == 200 || response.status == 201) {
        showToast(
          `🔥 ${
            groupName !== group_name
              ? group_name
              : group_description !== description
              ? group_description
              : 'Updated..!'
          } 🔥`,
          'Your gang details have been updated',
          'success',
        );
        setTimeout(() => {
          navigation.navigate('ChatScreen', {
            username: group_name,
            groupAdmin: groupAdmin,
            description: group_description,
            groupIcon: group_icon,
            isGroup: true,
            users: selectedFriends,
            chatId: chatId,
          });
        }, 2000);
      } else {
        throw new Error('Error updating group details');
      }
    } catch (error) {
      console.log('=== ERROR UPDATING GROUP DETAILS ===', error);
    }
  };
  React.useEffect(() => {
    if (addToGroup) {
      fetchFriends();
    }
  }, [addToGroup]);
  const debounceGetData = debounce(filterFriends, 500);
  return (
    <View style={styles.container}>
      <View style={{zIndex: 10}}>
        <Toast autoHide={false} />
      </View>
      <View style={styles.heading_container}>
        <TouchableOpacity
          onPress={() => {
            if (
              groupName !== group_name ||
              group_description !== description ||
              groupIcon !== group_icon
            )
              changeGroupDetails(group_name, group_description);
            else {
              navigation.goBack();
            }
          }}>
          <LeftArrow width={40} height={40} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.group_details_section}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View
          style={{
            borderWidth: 1,
            borderColor: themeBlue,
            borderRadius: 100,
            paddingVertical: height * 0.025,
            paddingHorizontal: width * 0.01,
            position: 'relative',
          }}>
          <Image
            source={groupIcon ? {uri: groupIcon} : ManIcon}
            style={styles.group_icon}
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
        <View style={styles.group_det_container}>
          <TextInput
            placeholder="Group Name"
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            textColor={themeWhite}
            value={group_name}
            onChangeText={text => {
              setGroupName(text);
            }}
            style={{
              backgroundColor: '#000',
              width: width * 0.9,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
              color: themeGrey,
              fontFamily: 'Lato-Regular',
            }}
          />

          <TextInput
            placeholder="Group Description"
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            textColor={themeWhite}
            value={group_description}
            onChangeText={text => {
              setGroupDescription(text);
            }}
            style={{
              backgroundColor: '#000',
              width: width * 0.9,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
              color: themeGrey,
              fontFamily: 'Lato-Regular',
            }}
          />
        </View>
        <ScrollView
          contentContainerStyle={{
            marginTop: height * 0.03,
            gap: width * 0.025,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            paddingRight: width * 0.05,
          }}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}>
          {selectedFriends &&
            selectedFriends.map((item, index) => {
              return (
                <View
                  style={{
                    padding: 5,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: themeYellow,
                    position: 'relative',
                  }}>
                  <Image
                    source={
                      item.profilePhoto ? {uri: item.profilePhoto} : ManIcon
                    }
                    style={{
                      width: width * 0.2,
                      height: height * 0.125,
                      borderRadius: 100,
                    }}
                  />
                  {item._id != groupAdmin._id &&
                    user.user._id == groupAdmin._id && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          paddingVertical: 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 10,
                          borderRadius: 100,
                          backgroundColor: themeRed,
                        }}
                        onPress={async () => {
                          console.log('request sent');
                          showToast(
                            'Told You 😏',
                            'Anyways..! Kicking him out..',
                            'info',
                          );
                          try {
                            console.log('chatId', chatId);
                            console.log('userId', item._id);
                            const body = {chatId: chatId, userId: item._id};
                            const response = await fetch(
                              `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user.user._id}/group-remove`,
                              {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(body),
                              },
                            );
                            console.log(
                              '=== DELETE MEMBER RESPONSE ===',
                              response,
                            );
                            if (
                              response.status == 200 ||
                              response.status == 201
                            ) {
                              showToast(
                                '🤟Here You Go🤟',
                                'Kicked The Shit Out..!😏',
                                'success',
                              );
                              setSelectedFriends(prev =>
                                prev.filter(friend => friend._id != item._id),
                              );
                            }
                          } catch (error) {
                            console.log('error', error);
                          }
                        }}>
                        <Text
                          style={{
                            color: themeWhite,
                            fontFamily: 'Poppins-Bold',
                            fontSize: 20,
                          }}>
                          X
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              );
            })}
          {user.user._id == groupAdmin._id && (
            <TouchableOpacity
              style={{
                width: width * 0.2,
                height: height * 0.125,
                borderRadius: 100,
                backgroundColor: themeYellow,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
              }}
              onPress={() => setAddToGroup(prev => !prev)}>
              <PlusIcon width={40} height={40} />
            </TouchableOpacity>
          )}
        </ScrollView>
        {addToGroup && (
          <>
            <View
              style={{
                width: width * 0.9,
                marginTop: height * 0.05,
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
                  width: '95%',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: '#000',
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
                    onPress={async () => {
                      showToast('⌛⏳⏲️⏳⌛', 'Adding to your gang', 'info');
                      if (selectedFriends.find(item2 => item2._id === item._id))
                        return;
                      console.log('=== CHAT ID ===', chatId);
                      console.log('=== USER ID ===', item._id);
                      try {
                        const response = await axios.put(
                          `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user.user._id}/group-add-member`,
                          {chatId: chatId, userId: item._id},
                        );

                        if (response.status == 200 || response.status == 201) {
                          showToast(
                            '🤟🔥 THERE HE IS 🔥🤟',
                            'Added to your gang',
                            'success',
                          );
                          setSelectedFriends(prev => [...prev, item]);
                        }
                      } catch (error) {
                        console.log(error.message);
                      }
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
          </>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: themeRed,
            padding: 10,
            borderRadius: 100,
            marginTop: height * 0.05,
            width: width * 0.85,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
          onPress={async () => {
            if (user.user._id == groupAdmin._id) {
              showToast(
                'HEHE 🦍',
                'You cannot leave the group as you are the admin',
                'info',
              );
            } else {
              try {
                const body = {chatId: chatId, userId: user.user._id};
                const response = await fetch(
                  `https://tame-rose-monkey-suit.cyclic.app/api/v1/chat/${user.user._id}/group-remove`,
                  {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                  },
                );
                const data = await response.json();
                if (response.status == 200 || response.status == 201) {
                  showToast(
                    '🦍🦍 LEFT SUCCESSFULLY 🦍🦍',
                    'Think twice before joining any other group again😏',
                    'success',
                  );
                  setTimeout(() => {
                    navigation.navigate('homepage');
                  }, 2000);
                }
              } catch (error) {}
            }
          }}>
          {/* <Logout width={30} height={30} /> */}
          <Text
            style={{
              color: themeWhite,
              fontFamily: 'Poppins-Medium',
              fontSize: 20,
            }}>
            Leave Group
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChatEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeBlack,
  },
  heading_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  group_details_section: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: height * 0.1,
  },
  group_icon: {
    width: width * 0.5,
    borderRadius: 100,
    height: height * 0.25,
  },
  group_det_container: {
    justifyContent: 'center',
    gap: height * 0.025,
    marginTop: height * 0.05,
  },
});
