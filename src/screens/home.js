import React, {useEffect, useRef, useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Keyboard,
	BackHandler,
	Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
	sendFormData,
	getAuthToken,
	getDataField,
} from '../redux/reducers/dataReducer';

import {} from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import Form from 'react-native-form';
import {TextInput, Button, ActivityIndicator} from 'react-native-paper';
import ListItem from '../components/ListItem';

const backAction = () => {
	Alert.alert('Hold on!', 'Are you sure you want to Exit?', [
		{
			text: 'Cancel',
			onPress: () => null,
			style: 'cancel',
		},
		{text: 'YES', onPress: () => BackHandler.exitApp()},
	]);
	return true;
};

var customFields = {
	CalendarPicker: {
		controlled: true,
		valueProp: 'date',
		callbackProp: 'onDateChange',
	},
};

const Home = ({navigation}) => {
	const formData = useRef(null);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [index, setIndex] = useState(undefined);
	const [refresh, onChangeRefresh] = useState(1);
	const {authHeader, dataTemplate, isLoading} = useSelector(
		state => state.data,
	);

	//console.log(isLoading, dataTemplate);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);
		dispatch(getAuthToken());

		return () => backHandler.remove();
	}, []);

	useEffect(() => {
		authHeader && dispatch(getDataField());
	}, [authHeader]);

	const DisplayData = () => {
		Keyboard.dismiss();
		for (const key in formData.current.fields) {
			formData.current.fields[key.replace('null', '')] =
				formData.current.fields[key];
			delete formData.current.fields[key];
		}

		Object.entries(formData.current.fields).map(entry => {
			let key = entry[0];
			formData.current.fields[key] =
				formData.current.fields[key]['value'];
		});

		console.log(formData.current.fields);

		if (formData.current.fields != null) {
			dispatch(sendFormData(formData.current.fields));
			onChangeRefresh(refresh + 1);
		}
	};

	const BuildInputFields = () => {
		return dataTemplate.map((element, index) => {
			return (
				<View key={index} style={{paddingHorizontal: 10}}>
					{element.Type == 'Edm.DateTimeOffset' ||
					element.Type == 'Edm.Date' ? (
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: '#AEAEAE',
								marginVertical: 5,
								backgroundColor: '#E7E7E7',
								paddingBottom: 2,
							}}>
							<TouchableOpacity
								onPress={() => setShow(!show)}
								style={{alignItems: 'flex-start'}}>
								<Text
									style={{
										fontSize: 17,
										fontWeight: '400',
										padding: 12,
									}}>
									{element.Name}
								</Text>
							</TouchableOpacity>
							{show ? (
								<View>
									<CalendarPicker
										type="CalendarPicker"
										name={element.Name}
									/>
								</View>
							) : (
								<></>
							)}
						</View>
					) : (
						<TextInput
							onFocus={() => setShow(false)}
							label={element.Name}
							type="TextInput"
							name={element.Name}
							keyboardType={
								element.Type == 'Edm.String'
									? 'default'
									: 'numeric'
							}
							style={{marginVertical: 5}}
						/>
					)}
				</View>
			);
		});
	};

	return (
		<View style={{flex: 1}}>
			{isLoading ? (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<ActivityIndicator
						animating={true}
						color="#ff66be"
						size={100}
					/>
				</View>
			) : (
				<SafeAreaView>
					<TouchableOpacity
						onPress={() => {
							setShow(false);
							Keyboard.dismiss();
						}}>
						<ScrollView style={StyleSheet.container}>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									paddingTop: 10,
								}}>
								<TouchableOpacity>
									<Text
										style={{
											fontSize: 25,
											fontWeight: 'bold',
										}}>
										Create New Contact
									</Text>
								</TouchableOpacity>
							</View>

							<Form ref={formData} customFields={customFields}>
								<View>{BuildInputFields()}</View>
							</Form>
							<View style={{height: 70}} />
						</ScrollView>

						<Button
							mode="contained"
							onPress={() => DisplayData()}
							style={{
								alignSelf: 'center',
								position: 'absolute',
								bottom: 10,
							}}>
							Submit
						</Button>
					</TouchableOpacity>
				</SafeAreaView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: '10%',
	},
});

export default Home;
