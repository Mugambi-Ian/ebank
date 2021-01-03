/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';
import {slideInUp, slideOutLeft} from '../../assets/anim/index';
import {StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
navigator.geolocation = require('@react-native-community/geolocation');

export default class Home extends Component {
  render() {
    return (
      <Animatable.View
        duration={800}
        animation={this.state.exit === false ? slideInUp : slideOutLeft}
        style={styles.mainContent}>
        <StatusBar style="dark" />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
});
