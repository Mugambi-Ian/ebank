import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {fadeIn, slideInRight} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';
import database from '@react-native-firebase/database';

const style = StyleSheet.create({
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
    marginTop: 80,
    marginBottom: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
export default class Home extends Component {
  state = {
    init: false,
    loading: true,
    fingerAuth: true,
    userInfo: {},
  };
  componentDidMount() {
    _database
      .ref('users')
      .child(_auth.currentUser.uid)
      .on('value', (snapshot) => {
        this.setState({loading: false});
        if (snapshot.hasChild('info')) {
          this.setState({userInfo: snapshot.child('info').val()});
        } else {
          this.setState({init: true});
        }
      });
  }
  render() {
    return (
      <Animatable.View animation={fadeIn} style={style.mainContent}>
        <StatusBar barStyle="light-content" backgroundColor="#118fca" />
        {this.state.loading === true ? (
          <View style={style.mainContent}>
            <PulseIndicator color={'#118fca'} style={style.loader} size={100} />
            <Text style={style.loaderText}>Please Hold...</Text>
          </View>
        ) : this.state.init === true || this.state.editInfo === true ? (
          <GettingStarted
            openSnack={this.props.openSnack}
            closeSnack={this.props.closeSnack}
            openTimedSnack={this.props.openTimedSnack}
            biometricAuth={() => {
              this.setState({
                fingerAuth: true,
                init: false,
                editInfo: undefined,
              });
            }}
            userInfo={this.state.userInfo}
          />
        ) : this.state.fingerAuth ? (
          this.state.fingerAuth === 'authenticated' ? (
            <AppHome
              unauthorizeUser={this.props.unauthorizeUser}
              editInfo={async () => {
                this.setState({
                  editInfo: true,
                });
              }}
            />
          ) : (
            <FingerAuth
              goHome={() => {
                this.setState({fingerAuth: 'authenticated'});
              }}
            />
          )
        ) : (
          <View />
        )}
      </Animatable.View>
    );
  }
}

class GettingStarted extends Component {
  state = {
    createdOn: '',
    userName: '',
    address: '',
    email: '',
    uId: _auth.currentUser.uid,
  };
  async componentDidMount() {
    if (this.props.userInfo.userName) {
      await setTimeout(() => {
        this.setState(this.props.userInfo);
      }, 100);
    } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      await setTimeout(() => {
        this.setState({createdOn: dd + '.' + mm + '.' + yyyy});
      }, 100);
    }
  }

  render() {
    return (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Text style={style.startedTitle}>Create your account</Text>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Created On</Text>
          <TextInput
            style={style.input}
            placeholder="5.1.2021"
            onChangeText={(x) => {}}
            value={this.state.createdOn}
            editable={false}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>User Name</Text>
          <TextInput
            style={style.input}
            placeholder="John Doe"
            onChangeText={(x) => {
              this.setState({userName: x});
            }}
            value={this.state.userName}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Address</Text>
          <TextInput
            style={style.input}
            placeholder="20th Street Blvd"
            onChangeText={(x) => {
              this.setState({address: x});
            }}
            value={this.state.address}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Email</Text>
          <TextInput
            style={style.input}
            placeholder="user@domain.com"
            onChangeText={(x) => {
              this.setState({email: x});
            }}
            value={this.state.email}
          />
        </View>
        <TouchableOpacity
          style={style.btnSpaced}
          onPress={async () => {
            await setTimeout(async () => {
              const {address, createdOn, email, userName} = this.state;
              const p = {address, createdOn, email, userName};
              await _database
                .ref('users')
                .child(this.state.uId + '/info')
                .set(p);
              this.props.biometricAuth();
              this.props.openTimedSnack('Save Succeful!');
            }, 100);
          }}>
          <Text style={style.btnText}>Save Info</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
class FingerAuth extends Component {
  async componentDidMount() {
    await setTimeout(() => {
      this.props.goHome();
    }, 3000);
  }
  render() {
    return (
      <Animatable.View animation={fadeIn} style={style.mainContent}>
        <Image
          source={require('../../assets/drawables/fingerprint.png')}
          style={style.fingerPrint}
        />
        <Text style={style.startedTitle}>
          Place you fingerprint for authentication
        </Text>
      </Animatable.View>
    );
  }
}

class AppHome extends Component {
  render() {
    return (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Image
          source={require('../../assets/drawables/logo.png')}
          style={style.logo}
        />
        <TouchableOpacity
          style={style.btn}
          onPress={async () => {
            await setTimeout(async () => {
              const {address, createdOn, email, userName} = this.state;
              const p = {address, createdOn, email, userName};
              await _database
                .ref('users')
                .child(this.state.uId + '/info')
                .set(p);
              this.props.biometricAuth();
              this.props.openTimedSnack('Save Succeful!');
            }, 100);
          }}>
          <Text style={style.btnText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.btn}>
          <Text style={style.btnText}>Send Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.btn}>
          <Text style={style.btnText}>My Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.btn}
          onPress={async () => {
            await setTimeout(() => {
              this.props.openInfo();
            }, 100);
          }}>
          <Text style={style.btnText}>My Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.btn}
          onPress={async () => {
            await setTimeout(async () => {
              await _auth.signOut();
              this.props.unauthorizeUser();
              this.props.openTimedSnack('Signed out!');
            }, 100);
          }}>
          <Text style={style.btnText}>Logout</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
