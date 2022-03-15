import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import Login from './src/auth/login';
import SignUp from './src/auth/signup';
import firebase from '@react-native-firebase/app';
import ChatList from './src/auth/chat/chatList';
import ChatScreen from './src/auth/chat';
import {
  GetFirebaseAuth,
  GetFireStoreApp,
  GetFireStoreDatabase,
} from './src/utils/firebaseMethods';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState('');
  const Stack = createNativeStackNavigator();
  firebase.setLogLevel('info');
  useEffect(() => {
    // const userId = GetFirebaseAuth?.currentUser?.uid;
    // const reference = GetFireStoreDatabase?.ref(`/online/${userId}`);
    // reference?.set(true).then(() => console.log("onLIne"), setActiveUserStatus('Online'));
    // if (!firebase?.apps?.length) {
    //   firebase?.initializeApp();
    // }
    // reference
    //   .onDisconnect()
    //   .remove()
    //   .then(() => setActiveUserStatus('Offline'));

    GetFirebaseAuth.onAuthStateChanged(user => {
      if (user) {
        GetFireStoreApp.collection('Users').doc(user?.uid).update({
          status: 'Online',
        });
        setStatus('Online');
        setIsLoggedIn(true);
      } else {
        setStatus('Offline');
        setIsLoggedIn(false);
      }
    });
  }, []);

  const AuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={SignUp} />
      </Stack.Navigator>
    );
  };

  const AppStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="chatList"
          component={ChatList}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="chat"
          component={ChatScreen}
        />
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#ff7979'} />
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
