import React, {useState, useEffect} from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Keyboard,
	BackHandler,
} from 'react-native';
import {
	TextInput,
	Button,
	ActivityIndicator,
	Divider,
} from 'react-native-paper';
import {
	getAuthToken,
	getContacts,
	getBankDetails,
	createSalaryCertificate,
} from '../redux/reducers/dataReducer';
import {useSelector, useDispatch} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';

const EmirateData = [
	{label: 'Abu Dhabi', value: 1},
	{label: 'Ajman', value: 4},
	{label: 'Dubai', value: 2},
	{label: 'Fujairah', value: 7},
	{label: 'Ras-Al-Khaimah', value: 6},
	{label: 'Sharjah', value: 3},
	{label: 'Umm-Al Qaiwain', value: 5},
	{label: 'Unknown', value: 99},
];

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

const Home = () => {
	const [bankName, setBankName] = useState([]);
	const [empName, setEmpName] = useState([]);

	const [selectedBank, setSelectedBank] = useState(null);
	const [selectedEmp, setSelectedEmp] = useState(null);
	const [Emirate, onChangeEmirate] = useState(null);

	const [selectedBankObj, setSelectedBankObj] = useState(null);
	const [selectedEmpObj, setSelectedEmpObj] = useState(null);
	const [EmirateObj, onChangeEmirateObj] = useState(null);

	const [bankAddress, onChangeBankAddress] = useState(null);
	const [Mobile, onChangeMobile] = useState(null);
	const [additionalInformation, onChangeAdditionalInformation] = useState();

	const [activate, onChangeActivate] = useState(false);

	const dispatch = useDispatch();
	const {authHeader, bankArray, EmpArray, isLoading} = useSelector(
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
		authHeader && dispatch(getContacts(authHeader));
		authHeader && dispatch(getBankDetails(authHeader));
	}, [authHeader]);

	useEffect(() => {
		const bankData = [];
		if (bankArray) {
			bankArray.forEach(element => {
				bankData.push({
					label: element.dp_name,
					value: element.dp_bankdetailsid,
				});
			});
		}
		setBankName(bankData);
	}, [bankArray]);

	useEffect(() => {
		const empData = [];
		if (EmpArray) {
			EmpArray.forEach(element => {
				empData.push({
					label: element.fullname,
					value: element.contactid,
				});
			});
		}
		setEmpName(empData);
	}, [EmpArray]);

	const DisplayData = () => {
		onChangeActivate(true);
		Keyboard.dismiss();
		if (
			selectedBank == null ||
			selectedEmp == null ||
			bankAddress == null ||
			Emirate == null ||
			Mobile == null
		) {
			Alert.alert('Fill All Required Fields');
		} else {
			let finalPayload = {
				jf_jafzalettertype: 0,
				fz_address: bankAddress,
				jf_mobileno: '0097150' + Mobile,
				jf_reasonforrequestadditionalinformation: additionalInformation,
				jf_emirate: EmirateObj.value,
				'fz_contactid@odata.bind': `/contacts(${selectedEmpObj.value})`,
				'jf_bankname@odata.bind': `/dp_bankdetailses(${selectedBankObj.value})`,
			};

			dispatch(createSalaryCertificate(finalPayload));
		}
	};

	const _renderItem = item => {
		return (
			<View style={styles.item}>
				<Text style={styles.textItem}>{item.label}</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={{alignItems: 'center', padding: 20}}>
				<Text
					style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
					Salary Certificate
				</Text>
			</View>
			<ScrollView>
				<View style={{marginHorizontal: 10}}>
					<View
						style={{
							borderWidth: 1,
							paddingLeft: 5,
							paddingTop: 5,
							backgroundColor: '#E7E7E7',
						}}>
						<Text>Employee Name</Text>
						<Dropdown
							style={
								(styles.dropdown, {backgroundColor: '#E7E7E7'})
							}
							containerStyle={styles.shadow}
							data={empName}
							labelField="label"
							valueField="value"
							label="Dropdown"
							placeholder="Select Employee"
							value={selectedEmp}
							onChange={item => {
								setSelectedEmp(item.value);
								setSelectedEmpObj(item);
							}}
							renderItem={item => _renderItem(item)}
							textError="Error"
						/>
					</View>
					{activate ? (
						selectedEmp == null ? (
							<View style={{backgroundColor: 'red', height: 4}} />
						) : (
							<></>
						)
					) : (
						<></>
					)}
					<View>
						<View
							style={{
								borderWidth: 1,
								backgroundColor: '#E7E7E7',
								marginVertical: 10,
							}}>
							<Text style={{paddingLeft: 5, paddingTop: 5}}>
								Bank Name
							</Text>
							<Dropdown
								style={
									(styles.dropdown,
									{
										backgroundColor: '#E7E7E7',
										paddingLeft: 5,
										paddingTop: 5,
									})
								}
								containerStyle={styles.shadow}
								data={bankName}
								labelField="label"
								valueField="value"
								label="Dropdown"
								placeholder="Select Bank"
								value={selectedBank}
								onChange={item => {
									setSelectedBank(item.value);
									setSelectedBankObj(item);
								}}
								renderItem={item => _renderItem(item)}
								textError="Error"
							/>
							{activate ? (
								selectedBank == null ? (
									<View
										style={{
											backgroundColor: 'red',
											height: 4,
										}}
									/>
								) : (
									<></>
								)
							) : (
								<></>
							)}
						</View>
					</View>
					<View
						style={{
							borderColor: '#000',
							borderWidth: 1,
						}}>
						<TextInput
							label="Bank Address"
							value={bankAddress}
							onChangeText={text => onChangeBankAddress(text)}
							multiline={true}
							//activeUnderlineColor="#E7E7E7"
						/>
					</View>
					{activate ? (
						bankAddress == null ? (
							<View style={{backgroundColor: 'red', height: 4}} />
						) : (
							<></>
						)
					) : (
						<></>
					)}
					<View>
						<View
							style={{
								borderWidth: 1,
								marginVertical: 10,
								backgroundColor: '#E7E7E7',
							}}>
							<Text style={{paddingLeft: 5, paddingTop: 5}}>
								Emirate
							</Text>
							<Dropdown
								style={
									(styles.dropdown,
									{
										backgroundColor: '#E7E7E7',
										paddingLeft: 5,
										paddingTop: 5,
									})
								}
								containerStyle={styles.shadow}
								data={EmirateData}
								labelField="label"
								valueField="value"
								label="Dropdown"
								placeholder="Select Emirate"
								value={Emirate}
								onChange={item => {
									onChangeEmirate(item.value);
									onChangeEmirateObj(item);
								}}
								renderItem={item => _renderItem(item)}
								textError="Error"
							/>
							{activate ? (
								Emirate == null ? (
									<View
										style={{
											backgroundColor: 'red',
											height: 4,
										}}
									/>
								) : (
									<></>
								)
							) : (
								<></>
							)}
						</View>
					</View>

					<View
						style={{
							borderColor: '#000',
							borderTopWidth: 1,
							borderLeftWidth: 1,
							borderRightWidth: 1,
							marginVertical: 10,
						}}>
						<View
							style={{
								backgroundColor: '#E7E7E7',
								paddingLeft: 5,
								paddingTop: 5,
							}}>
							<Text>Phone Number</Text>
						</View>

						<View
							style={{
								flexDirection: 'row',
								flex: 1,
								alignItems: 'center',
							}}>
							<View
								style={{
									backgroundColor: '#E7E7E7',
									height: '100%',
									borderBottomColor: '#6200EE',
									justifyContent: 'flex-end',
									paddingBottom: 22,
									paddingLeft: 10,
								}}>
								<Text
									style={{
										color: '#191919',
										fontSize: 16,
									}}>
									0097150
								</Text>
							</View>

							<TextInput
								value={Mobile}
								maxLength={7}
								onChangeText={
									text => {
										text.replace(/[^0-9]/g, '');
										onChangeMobile(text);
									}
									// text.length < 8
									// 	? onChangeMobile(text)
									// 	: text
								}
								style={{marginVertical: 5}}
								keyboardType="phone-pad"
								style={{flex: 1}}
								//activeUnderlineColor="#E7E7E7"
							/>
						</View>
						{activate ? (
							Mobile == null ? (
								<View
									style={{backgroundColor: 'red', height: 4}}
								/>
							) : (
								<></>
							)
						) : (
							<></>
						)}
					</View>

					<View style={{borderColor: '#000', borderWidth: 1}}>
						<TextInput
							label="Additional information"
							value={additionalInformation}
							onChangeText={text =>
								onChangeAdditionalInformation(text)
							}
							multiline={true}
						/>
					</View>
				</View>
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	picker: {
		width: '100%',
		borderColor: '#000',
		borderWidth: 2,
	},
	dropdown: {
		backgroundColor: 'white',
		borderBottomColor: 'gray',
		borderBottomWidth: 0.5,
		marginTop: 20,
		color: '#000',
	},
	icon: {
		marginRight: 5,
		width: 18,
		height: 18,
	},
	item: {
		paddingVertical: 17,
		paddingHorizontal: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
});

export default Home;
