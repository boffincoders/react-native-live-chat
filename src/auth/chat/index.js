import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {GetFirebaseAuth, GetFireStoreApp} from '../../utils/firebaseMethods';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Text, TouchableOpacity, View} from 'react-native';
const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
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
      if (user) {
        setCurrentUser(user?._user?.uid);
      }
    });
    const subscribe = GetFireStoreApp.collection('chatId').onSnapshot(
      snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            const data = change.doc.data();
            let epochTimestamp = data.createdAt.toMillis();
            data.createdAt = new Date(epochTimestamp);
            setMessages(oldMessages => GiftedChat.append(oldMessages, data));
          }
        });
      },
    );
    return () => subscribe();
  }, []);
  const onSend = messagesData => {
    GetFireStoreApp.collection('chatId')
      .doc(Date.now().toString())
      .set(messagesData[0]);
  };
  const Header = ({item}) => {
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
          <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>
            Chat App
          </Text>
        </View>
        <Text style={{paddingHorizontal: 42}}>{item.status}</Text>
      </View>
    );
  };
  return (
    <View>
      {users.map((x, index) => {
        return x.uid === currentUser && <Header item={x} />;
      })}

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{_id: currentUser}}
      />
    </View>
  );
};

export default ChatScreen;
