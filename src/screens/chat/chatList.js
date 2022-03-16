import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Badge, Button} from 'react-native-elements';
import {
  GetFirebaseAuth,
  GetFireStoreApp,
  GetFireStoreDatabase,
} from '../../utils/firebaseMethods';
export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const navigation = useNavigation();
  const [userActive, setUserActive] = useState();
  useEffect(() => {
    GetFireStoreDatabase.ref(`/online/${currentUser?.uid}`).on(
      'value',
      snapshot => {
        const status = snapshot.val();
        if (status) {
          setUserActive(true);
        } else if (status === undefined && status === null && status === '') {
          setUserActive(false);
        }
      },
    );
    StatusBar.setBarStyle('dark-content', false);
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
    GetFirebaseAuth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
  }, []);
  const handleLogout = () => {
    GetFirebaseAuth.signOut().then(() => {
      console.log('signedOut');
    });
    GetFireStoreApp.collection('Users').doc(currentUser.uid).update({
      status: 'Offline',
    });
  };

  return (
    <View style={{flex: 1, paddingTop: 10}}>
      <View style={styles.container}>
        <View style={styles.searchView}></View>
        <ScrollView>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '900',
              fontSize: 25,
              color: 'black',
            }}>
            Users
          </Text>
          {users.map((user, index) =>
            user.uid === currentUser.uid ? null : (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('chat')}
                style={styles.userCard}>
                <View style={styles.userCardRight}>
                  {/* <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: 'white',
                    }}>{`${user.name}`}</Text> */}
                  <Text style={{color: 'white'}}>{`${user?.email}`}</Text>
                  {userActive ? (
                    <View style={{flexDirection : "row" , alignItems : "center"}}>
                      <View
                        style={{
                          backgroundColor: 'green',
                          height: 10,
                          width: 10,
                          borderRadius: 20,
                        }}></View>
                        <Text style={{color: 'white' , marginLeft : 5}}>Active</Text>
                    </View>
                  ) : (
                    <View style={{flexDirection : "row" , alignItems : "center" }}>
                      <View
                        style={{
                          backgroundColor: 'red',
                          height: 10,
                          width: 10,
                          borderRadius: 20,
                        }}></View>
                        <Text style={{color: 'white' , marginLeft : 5}}>Offline</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ),
          )}

          <View style={{height: 50}}></View>
        </ScrollView>
      </View>
      <Button title={'LogOut'} onPress={handleLogout}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: '#dfe4ea',
    paddingHorizontal: 10,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  userCard: {
    backgroundColor: '#ff7979',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: '500',
  },
});
