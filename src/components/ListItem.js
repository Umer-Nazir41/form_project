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
import {TextInput} from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';

const ListItem = ({element, show, index, setIndex}) => {
	return (
		<View style={{paddingHorizontal: 10}}>
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
						onPress={() => setIndex(index)}
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
					onFocus={() => setIndex(index)}
					label={element.Name}
					type="TextInput"
					name={element.Name}
					keyboardType={
						element.Type == 'Edm.String' ? 'default' : 'numeric'
					}
					style={{marginVertical: 5}}
				/>
			)}
		</View>
	);
};

export default ListItem;
