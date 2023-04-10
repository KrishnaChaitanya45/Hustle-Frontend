import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TabContainer from '../../components/Tab/TabContainer';

const DiaryHomePage = () => {
  return (
    <TabContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Diary HomePage</Text>
      </View>
    </TabContainer>
  );
};

export default DiaryHomePage;

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
