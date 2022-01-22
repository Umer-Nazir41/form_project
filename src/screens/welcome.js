import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {setHeader, updateDataTemplate} from '../redux/reducers/dataReducer';
import {ActivityIndicator} from 'react-native-paper';
import Loader from 'react-native-modal-loader';
import axios from 'axios';
var parseString = require('react-native-xml2js').parseString;

const Welcome = ({navigation}) => {
  const [dataReceived, onChangeDataReceived] = useState(false);
  const [dataTemplate, onChangeDataTemplate] = useState([]);
  const [isLoading, onChangeLoading] = useState(true);
  const [codeExecuted, onChangeExecuted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!codeExecuted) {
      const getData = async () => {
        await axios
          .get(
            `https://zmssit.crm4.dynamics.com/api/data/v9.1/$metadata#contacts`,
          )
          .then(function (response) {
            parseString(response.data, function (err, result) {
              let fieldsArray =
                result['edmx:Edmx']['edmx:DataServices'][0]['Schema'][0][
                  'EntityType'
                ][84]['Property'];
              let tempArray = [];
              fieldsArray.forEach(element => {
                try {
                  tempArray = [...tempArray, element['$']];
                } catch (err) {
                  console.log(err);
                }
              });
              dispatch(updateDataTemplate(tempArray));
              onChangeLoading(false);
              onChangeDataReceived(true);
              onChangeExecuted(true);
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      };

      const getToken = async () => {
        const URL =
          'https://login.microsoftonline.com/2bd16c9b-7e21-4274-9c06-7919f7647bbb/oauth2/token?client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com';
        await fetch(URL, {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'client_id=c961d6dd-7168-497e-93fc-4eb43aecca2f&client_secret=3leOD-N1sOep4D2C-g5dv1eU~ovyp~7y6u&grant_type=client_credentials&resource=https://zmssit.crm4.dynamics.com',
        })
          .then(response => response.json())
          .then(data => {
            dispatch(setHeader(data.access_token));
            axios.defaults.headers.common = {
              Authorization: `Bearer ${data.access_token}`,
            };
            getData();
          })
          .catch(err => {
            console.log(err);
          });
      };

      getToken();
    }

    //getToken();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Loader loading={isLoading} color="#ff66be" opacity="0" size="large" /> */}
      <ActivityIndicator animating={true} color="#ff66be" size={100} />
      {dataReceived ? navigation.navigate('Home') : <></>}
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
