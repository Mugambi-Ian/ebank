import React, {Component} from 'react';
import {Image, StatusBar, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {fadeIn, slideOutLeft} from '../../assets/animations';

const style = StyleSheet.create({
  mainContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default class SplashScreen extends Component {
  state = {
    close: false,
  };
  async componentDidMount() {
    await setTimeout(async () => {
      this.setState({close: undefined});
      await setTimeout(() => {
        this.props.closeSplash();
      }, 600);
    }, 3000);
  }
  render() {
    return (
      <Animatable.View
        animation={this.state.close === false ? fadeIn : slideOutLeft}
        style={style.mainContent}>
        <StatusBar barStyle="light-content" backgroundColor="#fff" />
        <Image
          source={require('../../assets/drawables/logo.png')}
          style={style.logo}
        />
      </Animatable.View>
    );
  }
}
