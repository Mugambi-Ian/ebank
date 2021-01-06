import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';
class FingerAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined,
    };

    this.description = null;
  }

  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  };

  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  authCurrent() {
    FingerprintScanner.authenticate({title: 'Log in with Biometrics'}).then(
      () => {
        this.props.onAuthenticate();
        this.props.goHome();
      },
    );
  }

  authLegacy() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttemptedLegacy,
    })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        this.props.goHome();
      })
      .catch((error) => {
        this.setState({
          errorMessageLegacy: error.message,
          biometricLegacy: error.biometric,
        });
        this.description.shake();
      });
  }

  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({errorMessageLegacy: error.message});
    this.description.shake();
  };

  renderLegacy() {
    const {errorMessageLegacy, biometricLegacy} = this.state;
    const {style, handlePopupDismissedLegacy} = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
          <Image
            style={styles.logo}
            source={require('./assets/finger_print.png')}
          />

          <Text style={styles.heading}>Biometric{'\n'}Authentication</Text>
          <ShakingText
            ref={(instance) => {
              this.description = instance;
            }}
            style={styles.description(!!errorMessageLegacy)}>
            {errorMessageLegacy ||
              `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}>
            <Text style={styles.buttonText}>BACK TO MAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }

    // current API UI provided by native BiometricPrompt
    return null;
  };
}

FingerAuth.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};

export default FingerAuth;
