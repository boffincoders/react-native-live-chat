import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {GetFirebaseAuth, GetFireStoreApp} from '../../utils/firebaseMethods';

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
        isTyping={true}
        onSend={messages => onSend(messages)}
        user={{_id: currentUser}}
      />
  );
};

export default ChatScreen;