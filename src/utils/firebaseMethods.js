import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
export const GetFireStoreApp = firestore();
export const GetFirebaseAuth = auth();
export const GetFireStoreDatabase = database();
