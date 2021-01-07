import React, {Component} from 'react';
import {StatusBar, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {fadeIn} from '../../assets/animations';
import {style, _auth, _database} from '../../assets/config';
import GettingStarted from './getting-started';
import AppHome from './dashboard';
import FingerAuth from './biometrics/biometrics';

export default class Home extends Component {
  state = {
    init: false,
    loading: true,
    fingerAuth: true,
    userInfo: {},
    accountBalance: 0,
  };
  async componentDidMount() {
    await _database
      .ref('users')
      .child(_auth.currentUser.uid)
      .on('value', async (snapshot) => {
        this.setState({loading: false});
        if (snapshot.hasChild('info')) {
          const z = [];
          snapshot.child('transactions').forEach((i) => {
            z.push(i.val());
          });
          this.setState({
            userInfo: snapshot.child('info').val(),
            accountBalance: snapshot.child('accountBalance').val(),
            myTransactions: z,
          });
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
        ) : this.state.fingerAuth === 'authenticated' ? (
          this.state.init === true || this.state.editInfo === true ? (
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
              goHome={() => {
                this.setState({
                  init: false,
                  editInfo: undefined,
                });
              }}
              userInfo={this.state.userInfo}
            />
          ) : (
            <AppHome
              unauthorizeUser={this.props.unauthorizeUser}
              openInfo={async () => {
                this.setState({
                  editInfo: true,
                });
              }}
              accountBalance={
                this.state.accountBalance ? this.state.accountBalance : 0
              }
              myTransactions={this.state.myTransactions}
              openSnack={this.props.openSnack}
              closeSnack={this.props.closeSnack}
              openTimedSnack={this.props.openTimedSnack}
            />
          )
        ) : (
          <FingerAuth
            goHome={() => {
              this.setState({fingerAuth: 'authenticated'});
            }}
          />
        )}
      </Animatable.View>
    );
  }
}
