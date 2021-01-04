import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {fadeIn} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';
import database from '@react-native-firebase/database';

const style = StyleSheet.create({
  mainContent: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    top: 0,
    marginTop: '90%',
  },
  loaderText: {
    alignSelf: 'center',
    color: '#ffffff',
    backgroundColor: '#118fca',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    marginTop: '230%',
    borderRadius: 50,
    fontSize: 16,
    fontFamily: 'Quicksand-Light',
  },
  startedTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    alignSelf: 'center',
    color: '#118fca',
    fontSize: 25,
    marginTop: 30,
  },
});
export default class Home extends Component {
  state = {
    init: undefined,
    loading: true,
  };
  componentDidMount() {
    _database.ref().on('value', (snapshot) => {
      this.setState({loading: false});
      if (!snapshot.hasChild('info')) {
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
        ) : this.state.init === true ? (
          <GettingStarted
            openSnack={this.props.openSnack}
            closeSnack={this.props.closeSnack}
            openTimedSnack={this.props.openTimedSnack}
          />
        ) : (
          <View />
        )}
      </Animatable.View>
    );
  }
}

class GettingStarted extends Component {
  render() {
    return (
      <Animatable.View animation={fadeIn} style={style.mainContent}>
        <Text style={style.startedTitle}>Create your account</Text>
      </Animatable.View>
    );
  }
}
