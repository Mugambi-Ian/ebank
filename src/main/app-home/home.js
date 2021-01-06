import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {fadeIn, slideInLeft, slideInRight} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';
import FingerAuth from './biometrics/biometrics';

const style = StyleSheet.create({
  mainContent: {
    height: '100%',
    width: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    top: 0,
    marginTop: '70%',
  },
  loaderText: {
    alignSelf: 'center',
    color: '#ffffff',
    backgroundColor: '#118fca',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    marginTop: '150%',
    borderRadius: 50,
    fontSize: 16,
    fontFamily: 'Quicksand-Light',
  },
  startedTitle: {
    fontFamily: 'Quicksand-Medium',
    alignSelf: 'center',
    color: '#118fca',
    fontSize: 25,
    marginTop: 30,
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
  inputField: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  inputFieldText: {
    fontSize: 18,
    color: '#929292',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#000',
  },
  btn: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 5,
  },
  btnSpaced: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 20,
  },
  btnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    padding: 10,
  },
  fingerPrint: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logo: {
    height: 100,
    marginTop: 100,
    marginBottom: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  notificationText: {
    fontFamily: 'Quicksand-Light',
    alignSelf: 'center',
    color: '#000',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Quicksand-Light',
    alignSelf: 'center',
    color: '#000',
    fontSize: 22,
    marginTop: -10,
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
    textAlign: 'center',
  },
});
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
        if (snapshot.hasChild('accountBalance') === false) {
          await snapshot.child('accountBalance').ref.set(0);
        }
        if (snapshot.hasChild('info')) {
          this.setState({
            userInfo: snapshot.child('info').val(),
            accountBalance: snapshot.child('accountBalance').val(),
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
        ) : this.state.fingerAuth ? (
          this.state.fingerAuth === 'authenticated' ? (
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
          )
        ) : (
          <View />
        )}
      </Animatable.View>
    );
  }
}
function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return dd + '.' + mm + '.' + yyyy;
}
function getTime() {
  var today = new Date();
  var time =
    formatTime(today.getHours()) + ':' + formatTime(today.getMinutes());
  if (today.getHours() >= 12) {
    time = time + ' pm';
  } else {
    time = time + ' am';
  }
  return time;
}
function formatTime(x) {
  return x <= 9 ? '0' + x : x;
}
class GettingStarted extends Component {
  state = {
    createdOn: '',
    userName: '',
    address: '',
    email: '',
    uId: _auth.currentUser.uid,
    phoneNumber: _auth.currentUser.phoneNumber,
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      (x) => {
        if (this.props.userInfo) {
          this.props.goHome();
        } else {
          BackHandler.exitApp();
        }
        return true;
      },
    );
    if (this.props.userInfo.userName) {
      await setTimeout(() => {
        this.setState(this.props.userInfo);
      }, 100);
    } else {
      await setTimeout(() => {
        this.setState({createdOn: getDate()});
      }, 100);
    }
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Text style={style.startedTitle}>Personal Info</Text>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Created On</Text>
          <TextInput
            style={style.input}
            placeholder="5.1.2021"
            onChangeText={(x) => {}}
            value={this.state.createdOn}
            editable={false}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>User Name</Text>
          <TextInput
            style={style.input}
            placeholder="John Doe"
            onChangeText={(x) => {
              this.setState({userName: x});
            }}
            value={this.state.userName}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Address</Text>
          <TextInput
            style={style.input}
            placeholder="20th Street Blvd"
            onChangeText={(x) => {
              this.setState({address: x});
            }}
            value={this.state.address}
          />
        </View>
        <View style={style.inputField}>
          <Text style={style.inputFieldText}>Email</Text>
          <TextInput
            style={style.input}
            placeholder="user@domain.com"
            onChangeText={(x) => {
              this.setState({email: x});
            }}
            value={this.state.email}
          />
        </View>
        <TouchableOpacity
          style={style.btnSpaced}
          onPress={async () => {
            await setTimeout(async () => {
              const {
                address,
                createdOn,
                email,
                userName,
                phoneNumber,
              } = this.state;
              const p = {address, createdOn, email, userName, phoneNumber};
              await _database
                .ref('users')
                .child(this.state.uId + '/info')
                .set(p);
              await _database
                .ref('accounts/' + _auth.currentUser.phoneNumber)
                .set(_auth.currentUser.uid);
              this.props.biometricAuth();
              this.props.openTimedSnack('Save Succeful!');
            }, 100);
          }}>
          <Text style={style.btnText}>Save Info</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

class AppHome extends Component {
  state = {
    currentScreen: 'menu',
    accountBalance: undefined,
  };
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      (x) => {
        if (this.state.currentScreen === 'menu') {
          BackHandler.exitApp();
        }
        return true;
      },
    );
    await _database
      .ref('users/' + _auth.currentUser.uid + '/accountBalance')
      .on('value', (x) => {
        this.setState({accountBalance: x.val()});
      });
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  menu = (
    <Animatable.View animation={slideInRight}>
      <TouchableOpacity
        style={style.btn}
        onPress={async () => {
          await setTimeout(async () => {
            this.setState({currentScreen: 'withdraw'});
          }, 100);
        }}>
        <Text style={style.btnText}>Withdraw</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btn}
        onPress={async () => {
          await setTimeout(async () => {
            this.setState({currentScreen: 'send'});
          }, 100);
        }}>
        <Text style={style.btnText}>Send Money</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.btn}>
        <Text style={style.btnText}>My Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btn}
        onPress={async () => {
          await setTimeout(() => {
            this.props.openInfo();
          }, 100);
        }}>
        <Text style={style.btnText}>My Info</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.btn}
        onPress={async () => {
          await setTimeout(async () => {
            await _auth.signOut();
            this.props.unauthorizeUser();
            this.props.openTimedSnack('Signed out!');
          }, 100);
        }}>
        <Text style={style.btnText}>Logout</Text>
      </TouchableOpacity>
      <Text style={style.startedTitle}>
        Account Number {_auth.currentUser.phoneNumber}
      </Text>
      <Text style={style.title}>Account Balance</Text>
      <Text style={style.title}>
        $
        {this.state.accountBalance
          ? numberWithCommas(this.state.accountBalance)
          : numberWithCommas(this.props.accountBalance)}
        .00
      </Text>
    </Animatable.View>
  );
  render() {
    return this.state.currentScreen === 'myTransactions' ? (
      <MyTransactions />
    ) : (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Image
          source={require('../../assets/drawables/logo.png')}
          style={style.logo}
        />
        {this.state.currentScreen === 'menu' ? (
          this.menu
        ) : this.state.currentScreen === 'withdraw' ? (
          <Withdraw
            goHome={() => {
              this.setState({currentScreen: 'menu'});
            }}
            accountBalance={this.props.accountBalance}
            openSnack={this.props.openSnack}
            closeSnack={this.props.closeSnack}
            openTimedSnack={this.props.openTimedSnack}
          />
        ) : this.state.currentScreen === 'send' ? (
          <SendMoney
            goHome={() => {
              this.setState({currentScreen: 'menu'});
            }}
            accountBalance={this.props.accountBalance}
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
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
class Withdraw extends Component {
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
                          transactionType: this.state.Cash + 'Withdrawal',
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
class SendMoney extends Component {
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
                                    receievedAmount: this.state.amount,
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
                                    sentAmount: this.state.amount,
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
function generateUID() {
  return (
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-' +
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-' +
    ('0000' + (Math.random() * 46656).toString(36)).slice(-3) +
    '-'('0000' + (Math.random() * 46656).toString(36)).slice(-3)
  );
}
class MyTransactions extends Component() {
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
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Text style={style.startedTitle}>My Transactions</Text>
        {this.state.loading === true ? (
          <View style={style.mainContent}>
            <PulseIndicator color={'#118fca'} style={style.loader} size={100} />
            <Text style={style.loaderText}>Please Hold...</Text>
          </View>
        ) : (
          <ScrollView>
            {this.state.myTransactions.map((x, i) => {
              return x.transactionType === 'Recieved Money'
                ? this.transactionCard(
                    ts.receieved,
                    '#' +
                      x.transactionId +
                      ' confirmed that you recieved a total of $ ' +
                      numberWithCommas(x.transactionAmount) +
                      '.00 from ' +
                      x.senderPhoneNumber,
                    x,
                  )
                : x.transactionType === 'Sent Money'
                ? this.transactionCard(
                    ts.sent,
                    '#' +
                      x.transactionId +
                      ' confirmed that you sent a total of $ ' +
                      numberWithCommas(x.transactionAmount) +
                      '.00 to ' +
                      x.recipientPhoneNumber,
                    x,
                  )
                : x.transactionType === 'Token Withdrawal'
                ? this.transactionCard(
                    ts.token,
                    '#' +
                      '#' +
                      x.transactionId +
                      ' confirmed token withdrawal, a total of $ ' +
                      numberWithCommas(x.transactionAmount) +
                      '.00 . Your withdrawal token is ' +
                      x.tokenCode,
                    x,
                    x,
                  )
                : x.transactionType === 'Cash Withdrawal'
                ? this.transactionCard(
                    ts.cash,
                    '#' +
                      x.transactionId +
                      ' confirmed cash withdrawal, a total of $ ' +
                      numberWithCommas(x.transactionAmount) +
                      '.00',
                    x,
                  )
                : this.transactionCard(
                    ts.deposit,
                    '#' +
                      x.transactionId +
                      ' confirmed that a total of $ ' +
                      numberWithCommas(x.transactionAmount) +
                      '.00 has been deposited in your account',
                    x,
                  );
            })}
          </ScrollView>
        )}
      </Animatable.View>
    );
  }
  transactionCard(s, m, d) {
    return (
      <Animatable.View style={s} animation={slideInRight}>
        <Text style={ts.text1}>Date: {d.transactionDate}</Text>
        <Text style={ts.text1}>Time: {d.transactionTime}</Text>
        <Text style={ts.text1}>
          Amount: {'$ ' + numberWithCommas(d.transactionDate) + '.00'}
        </Text>
        <Text style={ts.text1}>Type: {d.transactionType}</Text>
        <Text style={ts.text2}>{m}</Text>
      </Animatable.View>
    );
  }
}
const ts = StyleSheet.create({
  text1: {},
  text2: {},
  receieved: {},
  sent: {},
  deposit: {},
  token: {},
  cash: {},
});
