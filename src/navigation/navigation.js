import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/home';
import Login from '../screens/login';

const Stack = createNativeStackNavigator();

function Navigation() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="login"
					component={Login}
					options={{headerShown: false, gestureEnabled: false}}
				/>
				{/* <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false, gestureEnabled: false}}
        /> */}
				<Stack.Screen
					name="Home"
					component={Home}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default Navigation;
