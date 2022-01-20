import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';

const Welcome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Home')}
        style={{
          padding: 10,
          width: '60%',
          alignSelf: 'center',
          margin: 10,
        }}>
        Open form
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Welcome;
