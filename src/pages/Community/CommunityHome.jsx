import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TabContainer from '../../components/Tab/TabContainer';

const CommunityHome = () => {
  return (
    <TabContainer>
      <View style={styles.container}>
        <Text style={styles.text}>CommunityHome</Text>
      </View>
    </TabContainer>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    color: '#595BD4',
  },
});
