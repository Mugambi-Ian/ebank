import React, {Component} from 'react';
import {
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {fadeIn, slideInRight} from '../../../assets/animations';
import {
  _auth,
  _database,
  getDate,
  getTime,
  numberWithCommas,
  style,
} from '../../../assets/config';

export default class SendMoney extends Component {
  state = {accountNumber: '', amount: '', confirm: false};
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
  }
  componentWillUnmount() {
    this.backHandler.remove;
  }
  render() {
    return (
      <Animatable.View animation={slideInRight}>
        <Text style={style.startedTitle}>Send Money</Text>
        <ScrollView>
          {this.state.confirm === false ? (
            <Animatable.View>
              <View style={style.inputField}>
                <Text style={style.inputFieldText}>Account Number</Text>
                <TextInput
                  style={style.input}
                  placeholder="+1 650-555-3434"
                  onChangeText={(x) => {
                    this.setState({accountNumber: x});
                  }}
                  value={this.state.accountNumber}
                />
              </View>
              <View style={style.inputField}>
                <Text style={style.inputFieldText}>Amount</Text>
                <TextInput
                  style={style.input}
                  placeholder="100"
                  onChangeText={(x) => {
                    this.setState({amount: x});
                  }}
                  value={this.state.amount}
                />
              </View>
              <TouchableOpacity
                style={style.btn}
                onPress={async () => {
                  setTimeout(async () => {
                    if (this.state.amount && this.state.accountNumber) {
                      this.setState({confirm: true});
                    } else {
                      this.props.openTimedSnack('All fields are required');
                    }
                  }, 100);
                }}>
                <Text style={style.btnText}>Send</Text>
              </TouchableOpacity>
            </Animatable.View>
          ) : (
            <Animatable.View animation={fadeIn}>
              <Text style={style.notificationText}>
                Confrim $ {numberWithCommas(this.state.amount)}.00 sent to{' '}
                {this.state.accountNumber}
              </Text>
              <TouchableOpacity
                style={style.btn}
                onPress={async () => {
                  setTimeout(async () => {
                    if (this.state.amount && this.state.accountNumber) {
                      if (this.props.accountBalance >= this.state.amount) {
                        await _database
                          .ref('accounts/' + this.state.accountNumber)
                          .once('value', async (data) => {
                            if (data.val()) {
                              await _database
                                .ref('users/' + data.val())
                                .once('value', async (z) => {
                                  const r = {
                                    transactionId: await z.ref.push().key,
                                    transactionAmount: this.state.amount,
                                    senderPhoneNumber:
                                      _auth.currentUser.phoneNumber,
                                    transactionDate: getDate(),
                                    transactionTime: getTime(),
                                    transactionType: 'Recieved Money',
                                  };
                                  z.ref
                                    .child('transactions/' + r.transactionId)
                                    .set(r, (_) => {
                                      const b = z.child('accountBalance');
                                      b.ref.set(
                                        parseInt(b.val()) +
                                          parseInt(this.state.amount),
                                      );
                                    });
                                });
                              await _database
                                .ref('users/' + _auth.currentUser.uid)
                                .once('value', async (z) => {
                                  const r = {
                                    transactionId: await z.ref.push().key,
                                    transactionAmount: this.state.amount,
                                    recipientPhoneNumber: data.key,
                                    transactionDate: getDate(),
                                    transactionTime: getTime(),
                                    transactionType: 'Sent Money',
                                  };
                                  z.ref
                                    .child('transactions/' + r.transactionId)
                                    .set(r, (_) => {
                                      const b = z.child('accountBalance');
                                      b.ref.set(
                                        parseInt(b.val()) -
                                          parseInt(this.state.amount),
                                      );
                                    });
                                });
                              this.props.goHome();
                              this.props.openTimedSnack('Sent Succesfull');
                            } else {
                              this.props.openTimedSnack('Recipient not found');
                            }
                          });
                      } else {
                        this.props.openTimedSnack('Insufficient Funds');
                      }
                    } else {
                      this.props.openTimedSnack('All fields are required');
                    }
                  }, 100);
                }}>
                <Text style={style.btnText}>Proceed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.btn}
                onPress={async () => {
                  setTimeout(async () => {
                    this.setState({confirm: false});
                  }, 100);
                }}>
                <Text style={style.btnText}>Cancel</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </ScrollView>
      </Animatable.View>
    );
  }
}
