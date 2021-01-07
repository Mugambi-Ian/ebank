import auth from '@react-native-firebase/auth';
import firebase from 'firebase';
import {StyleSheet} from 'react-native';
import config from './config';

firebase.initializeApp(config());
const card = StyleSheet.create({
  _: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 2,
    borderRadius: 10,
    borderWidth: 2,
  },
});
export const style = StyleSheet.create({
  mainContent: {
    height: '100%',
    width: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    top: 0,
    marginTop: '70%',
  },
  loaderText: {
    alignSelf: 'center',
    color: '#ffffff',
    backgroundColor: '#118fca',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    marginTop: '150%',
    borderRadius: 50,
    fontSize: 16,
    fontFamily: 'Quicksand-Light',
  },
  startedTitle: {
    fontFamily: 'Quicksand-Medium',
    alignSelf: 'center',
    color: '#118fca',
    fontSize: 25,
    marginTop: 30,
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
  inputField: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  inputFieldText: {
    fontSize: 18,
    color: '#929292',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#000',
  },
  btn: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 5,
  },
  btnSpaced: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 20,
  },
  btnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    padding: 10,
  },
  fingerPrint: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logo: {
    height: 100,
    marginTop: 100,
    marginBottom: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  notificationText: {
    fontFamily: 'Quicksand-Light',
    alignSelf: 'center',
    color: '#000',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Quicksand-Light',
    alignSelf: 'center',
    color: '#000',
    fontSize: 22,
    marginTop: -10,
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
  },
  text1: {
    color: '#000',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 15,
    fontFamily: 'Quicksand-Light',
  },
  text2: {
    alignSelf: 'center',
    color: '#122',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    paddingBottom: 10,
  },
  receieved: {...card._, borderColor: '#93e32e'},
  sent: {...card._, borderColor: '#118fca'},
  deposit: {...card._, borderColor: '#932'},
  token: {...card._, borderColor: '#12a'},
  cash: {...card._, borderColor: '#122'},
});

export const _auth = auth();
export const _database = firebase.database();
export function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return dd + '.' + mm + '.' + yyyy;
}
export function getTime() {
  var today = new Date();
  var time =
    formatTime(today.getHours()) + ':' + formatTime(today.getMinutes());
  if (today.getHours() >= 12) {
    time = time + ' pm';
  } else {
    time = time + ' am';
  }
  return time;
}
export function formatTime(x) {
  return x <= 9 ? '0' + x : x;
}
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function receivedString(x) {
  return (
    '#' +
    x.transactionId +
    ' confirmed that you recieved a total of $ ' +
    numberWithCommas(x.transactionAmount) +
    '.00 from ' +
    x.senderPhoneNumber
  );
}

export function tokenString(x) {
  return (
    '#' +
    x.transactionId +
    ' confirmed token withdrawal, a total of $ ' +
    numberWithCommas(x.transactionAmount) +
    '.00 . Your withdrawal token is ' +
    x.tokenCode
  );
}
export function cashString(x) {
  return (
    x.transactionId +
    ' confirmed cash withdrawal, a total of $ ' +
    numberWithCommas(x.transactionAmount) +
    '.00'
  );
}

export function depositString(x) {
  return (
    '#' +
    x.transactionId +
    ' confirmed that a total of $ ' +
    numberWithCommas(x.transactionAmount) +
    '.00 has been deposited in your account'
  );
}
export function sentString(x) {
  return (
    '#' +
    x.transactionId +
    ' confirmed that you sent a total of $ ' +
    numberWithCommas(x.transactionAmount) +
    '.00 to ' +
    x.recipientPhoneNumber
  );
}
