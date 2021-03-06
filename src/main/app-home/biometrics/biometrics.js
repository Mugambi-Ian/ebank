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
  BackHandler,
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
    await FingerprintScanner.isSensorAvailable().catch(async () => {
      this.props.openTimedSnack('Requires Biometric Authentication');
      await setTimeout(() => {
        BackHandler.exitApp();
      }, 2000);
    });
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }
  componentWillUnmount() {
    this.backHandler.remove;
    FingerprintScanner.release();
  }

  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  authCurrent() {
    FingerprintScanner.authenticate({title: 'Log in with Biometrics'})
      .then(() => {
        this.props.goHome();
      })
      .catch(() => {
        BackHandler.exitApp();
      });
  }

  authLegacy() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttemptedLegacy,
    })
      .then(() => {
        this.props.goHome();
      })
      .catch((error) => {
        this.setState({
          errorMessageLegacy: error.message,
          biometricLegacy: error.biometric,
        });
        this.description.shake();
        BackHandler.exitApp();
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
  style: ViewPropTypes.style,
};

export default FingerAuth;
