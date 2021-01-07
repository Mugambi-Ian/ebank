import React, {Component} from 'react';
import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {slideInRight} from '../../../assets/animations';
import {
  _auth,
  _database,
  numberWithCommas,
  style,
} from '../../../assets/config';
export default class MyTransactions extends Component() {
  state = {
    myTransactions: [],
    loading: true,
  };
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      (x) => {
        if (this.state.confirm === true) {
          this.setState({confirm: false});
        } else {
          this.props.goHome();
        }
        return true;
      },
    );
    await _database
      .ref('users')
      .child(_auth.currentUser.uid + '/transactions')
      .on('value', (x) => {
        const z = [];
        x.forEach((i) => {
          z.push(i.val());
        });
        this.setState({myTransactions: z, loading: false});
      });
  }
  componentWillUnmount() {
    this.backHandler.remove;
  }
  render() {
    return (
      <View animation={slideInRight} style={style.mainContent}>
        <Text style={style.startedTitle}>My Transactions</Text>
      </View>
    );
  }
}
