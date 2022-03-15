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

  return (
  
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{_id: currentUser}}
      />
  );
};

export default ChatScreen;