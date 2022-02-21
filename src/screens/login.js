import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

const Login = ({navigation}) => {
	const [email, onChangeEmail] = useState();
	const [password, onChangePassword] = useState();

	return (
		<View style={styles.container}>
			<Text
				style={{
					fontWeight: 'bold',
					fontSize: 22,
					alignSelf: 'center',
					marginBottom: '30%',
				}}>
				ZMS Posorja
			</Text>
			<TextInput
				label="Email"
				keyboardType="email-address"
				style={{marginVertical: 5}}
				value={email}
				onChangeText={text => {
					onChangeEmail(text);
				}}
			/>

			<TextInput
				label="Password"
				textContentType={'password'}
				maxLength={16}
				secureTextEntry={true}
				value={password}
				onChangeText={text => {
					onChangePassword(text);
				}}
				style={{marginVertical: 5}}
			/>

			<Button
				onPress={() => {
					navigation.navigate('Home');
				}}
				style={{
					width: '50%',
					alignSelf: 'center',
					marginTop: '10%',
					borderWidth: 2,
					borderColor: 'blue',
					borderRadius: 50,
				}}>
				Sign In
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 15,
		justifyContent: 'center',
	},
});

export default Login;
