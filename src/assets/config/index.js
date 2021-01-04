import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import config from './config';

firebase.initializeApp(config());
export const _auth = auth();
export const _database = firebase.database();
