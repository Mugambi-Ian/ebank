import React, {Component} from 'react';
import {
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {slideInRight} from '../../assets/animations';
import {_auth, _database, style, getDate} from '../../assets/config';

export default class GettingStarted extends Component {
  state = {
    createdOn: '',
    userName: '',
    address: '',
    email: '',
    uId: _auth.currentUser.uid,
    phoneNumber: _auth.currentUser.phoneNumber,
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      (x) => {
        if (this.props.userInfo) {
          this.props.goHome();
        } else {
          BackHandler.exitApp();
        }
        return true;
      },
    );
    if (this.props.userInfo.userName) {
      await setTimeout(() => {
        this.setState(this.props.userInfo);
      }, 100);
    } else {
      await setTimeout(() => {
        this.setState({createdOn: getDate()});
      }, 100);
    }
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Text style={style.startedTitle}>Personal Info</Text>
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
              const {
                address,
                createdOn,
                email,
                userName,
                phoneNumber,
              } = this.state;
              const p = {address, createdOn, email, userName, phoneNumber};
              await _database
                .ref('users')
                .child(this.state.uId + '/info')
                .set(p);
              await _database
                .ref('accounts/' + _auth.currentUser.phoneNumber)
                .set(_auth.currentUser.uid);
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
