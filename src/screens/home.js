import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {sendFormData} from '../redux/reducers/dataReducer';
import Form from 'react-native-form';
import {TextInput, Button} from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';

const Home = ({navigation}) => {
  const dataTemplate = useSelector(state => state.data.dataTemplate);
  let formData = useRef(null);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const DisplayData = () => {
    for (const key in formData.current.fields) {
      formData.current.fields[key.replace('null', '')] =
        formData.current.fields[key];
      delete formData.current.fields[key];
    }

    if (formData.current.fields != null) {
      dispatch(sendFormData(formData.current.fields));
      Alert.alert('Success', 'Data has been posted Successfully');
      navigation.goBack();
    }
  };

  var customFields = {
    CalendarPicker: {
      controlled: true,
      valueProp: 'date',
      callbackProp: 'onDateChange',
    },
  };

  const BuildInputFields = () => {
    return dataTemplate.map((element, index) => {
      return (
        <View key={index} style={{paddingHorizontal: 10}}>
          {element.type === 'Date' ? (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#AEAEAE',
                marginVertical: 5,
                backgroundColor: '#E7E7E7',
                paddingBottom: 2,
              }}>
              <Text style={{fontSize: 18, padding: 10}}>{element.title}</Text>
              <TouchableOpacity
                onPress={() => setShow(!show)}
                style={{alignItems: 'center'}}>
                <Text>{show ? 'Close' : 'Open'} Calender</Text>
              </TouchableOpacity>
              {show ? (
                <View>
                  <CalendarPicker type="CalendarPicker" name={element.title} />
                </View>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <TextInput
              label={element.title}
              type="TextInput"
              name={element.title}
              keyboardType={element.type !== 'String' ? 'numeric' : 'default'}
              style={{marginVertical: 5}}
            />
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={StyleSheet.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <TouchableOpacity>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>Form menu</Text>
          </TouchableOpacity>
        </View>

        <Form ref={formData} customFields={customFields}>
          <View>{BuildInputFields()}</View>
        </Form>

        <Button
          mode="contained"
          onPress={() => DisplayData()}
          style={{
            padding: 10,
            width: '60%',
            alignSelf: 'center',
            margin: 10,
          }}>
          Submit Data
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
  },
});

export default Home;
