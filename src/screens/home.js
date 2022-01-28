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
import Form from 'react-native-form';
import {TextInput, Button, ActivityIndicator} from 'react-native-paper';
import DatePicker from '../components/dateTime/datepicker';
import {format} from 'date-fns';

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
	DatePicker: {
		controlled: true,
		valueProp: 'date',
		callbackProp: 'onDateChange',
	},
};

const Home = ({navigation}) => {
	const formData = useRef(null);
	const dispatch = useDispatch();
	const [refresh, onChangeRefresh] = useState(1);
	const {authHeader, dataTemplate, isLoading} = useSelector(
		state => state.data,
	);

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
		const data = {};
		for (const key in formData.current.fields) {
			if (
				formData.current.fields[key].name == 'fz_title' &&
				formData.current.fields[key].value == ''
			) {
				data[formData.current.fields[key].name] = 1;
			}
			if (
				formData.current.fields[key].value == undefined ||
				formData.current.fields[key].value == ''
			) {
				continue;
			}
			data[formData.current.fields[key].name] =
				formData.current.fields[key].value;

			if (formData.current.fields[key].value instanceof Date) {
				data[formData.current.fields[key].name] = format(
					formData.current.fields[key].value,
					'yyyy-MM-dd',
				).toString();
			}
		}
		console.log(data);

		if (formData.current.fields != null) {
			dispatch(sendFormData(data));
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
							<Text
								style={{
									fontSize: 17,
									fontWeight: '400',
									padding: 12,
								}}>
								{element.Name}
							</Text>
							<DatePicker
								name={element.Name}
								type="DatePicker"
								key={index}
								style={{width: '100%'}}
								mode="date"
								//placeholder={''}
								format="YYYY-MM-DD"
								minDate="1950-05-01"
								maxDate="2050-06-01"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
							/>
						</View>
					) : (
						<TextInput
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
