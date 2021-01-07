import React, {Component} from 'react';
import {
  BackHandler,
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

function generateUID() {
  return (
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-' +
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-' +
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-' +
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3)
  );
}
export default class Withdraw extends Component {
  state = {
    amount: undefined,
    Cash: undefined,
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      (x) => {
        if (this.state.amount) {
          this.setState({amount: undefined});
        } else if (this.state.Cash) {
          this.setState({Cash: undefined});
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
        <Text style={style.startedTitle}>Withdrawal</Text>
        {this.state.amount && this.state.Cash ? (
          <Animatable.View animation={fadeIn}>
            <Text style={style.notificationText}>
              Confrim {this.state.Cash} withdrawl of $
              {numberWithCommas(this.state.amount)}.00
            </Text>
            <TouchableOpacity
              style={style.btn}
              onPress={async () => {
                setTimeout(async () => {
                  if (this.props.accountBalance >= this.state.amount) {
                    await _database
                      .ref('users')
                      .child(_auth.currentUser.uid)
                      .once('value', async (x) => {
                        const reciept = {
                          transactionId: await (await x.ref.push()).key,
                          transactionType: this.state.Cash + ' Withdrawal',
                          transactionAmount: this.state.amount,
                          transactionDate: getDate(),
                          transactionTime: getTime(),
                        };
                        if (this.state.Cash === 'Token') {
                          const tokenCode = generateUID();
                          reciept.tokenCode = tokenCode;
                          _database
                            .ref('tokens')
                            .child(tokenCode)
                            .set(reciept.transactionAmount);
                        }
                        const b =
                          this.props.accountBalance - reciept.transactionAmount;
                        x.child('transactions')
                          .ref.child(reciept.transactionId)
                          .set(reciept, (t) => {
                            x.child('accountBalance').ref.set(b);
                            this.props.openTimedSnack('Withdrawal Succesfull');
                            this.props.goHome();
                          });
                      });
                  } else {
                    this.props.openTimedSnack('Insufficient Funds');
                  }
                }, 100);
              }}>
              <Text style={style.btnText}>Proceed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.btn}
              onPress={async () => {
                await setTimeout(() => {
                  this.setState({amount: undefined});
                }, 100);
              }}>
              <Text style={style.btnText}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : this.state.Cash ? (
          <Animatable.View animation={slideInRight}>
            <View style={style.inputField}>
              <Text style={style.inputFieldText}>Amount</Text>
              <TextInput
                style={style.input}
                placeholder="100"
                onChangeText={(x) => {
                  this.setState({_amount: x});
                }}
                value={this.state._amount}
              />
            </View>
            <TouchableOpacity
              style={style.btn}
              onPress={async () => {
                await setTimeout(() => {
                  this.setState({amount: parseInt(this.state._amount)});
                }, 100);
              }}>
              <Text style={style.btnText}>
                {this.state.Cash === 'Token'
                  ? 'Generate Token'
                  : 'Withdraw Cash'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <Animatable.View animation={fadeIn}>
            <TouchableOpacity
              style={style.btn}
              onPress={async () => {
                await setTimeout(() => {
                  this.setState({Cash: 'Token'});
                }, 100);
              }}>
              <Text style={style.btnText}>Using Token</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.btn}
              onPress={async () => {
                await setTimeout(() => {
                  this.setState({Cash: 'Cash', _amount: undefined});
                }, 100);
              }}>
              <Text style={style.btnText}>Withdraw Cash</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  }
}
