import React, {Component} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {fadeIn} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';

const style = StyleSheet.create({
  mainContent: {flex: 1, height: '100%', width: '100%'},
});
export default class Home extends Component {
  state = {
    init: undefined,
    loading: true,
  };
  async componentDidMount() {
    await _database.ref('users/' + _auth.currentUser.uid).on('value', (x) => {
      if (x.hasChild('info')) {
        this.setState({loading: false});
      } else {
        this.setState({loading: false, init: true});
      }
    });
  }
  render() {
    <Animatable.View animation={fadeIn} style={style.mainContent}>
      <StatusBar barStyle="light-content" backgroundColor="#118fca" />
      {this.state.loading === true ? <View /> : <View />}
    </Animatable.View>;
  }
}
