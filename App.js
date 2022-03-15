import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState("")
  const Stack = createNativeStackNavigator();
  const currentUser = GetFirebaseAuth?.currentUser?.uid
  firebase.setLogLevel('info');
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase?.initializeApp();
    }
    GetFirebaseAuth.onAuthStateChanged(user => {
      if (user) {
        GetFireStoreApp.collection("Users").doc(user?.uid).update({
          status: "Online"
        })
        setStatus("Online")
        setIsLoggedIn(true);
      } else {
        setStatus("Offline")
        setIsLoggedIn(false);
      }
    });
    GetFireStoreApp.collection('Users')
      .get()
      .then(docs => {
        let array = [];
        docs.forEach(x => {
          const data = x.data();
          array.push(data);
        });
        setUsers(array);
      });
  }, []);
  const Header = ({ item }) => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View
          style={{
            width: '35%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('chatList')}>
            <AntDesign name="left" size={25} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>
            Chat App
          </Text>
        </View>
        <Text style={{ paddingHorizontal: 42 }}>{item.status}</Text>
      </View>
    )
  }
  const AuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={SignUp} />
      </Stack.Navigator>
    );
  };

  const AppStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="chatList"
          component={ChatList}
        />
        <Stack.Screen
          options={{
            headerShown: false, header: () => (
              users.map((x, index) => {
                return (
                  x?.uid === currentUser && <Header item={x} />
                )
              })
            )
          }}
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
