import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {slideInLeft, slideInRight} from '../../../assets/animations';
import {
  _auth,
  _database,
  numberWithCommas,
  style,
  receivedString,
  sentString,
  tokenString,
  cashString,
  depositString,
} from '../../../assets/config';

import SendMoney from './send';
import Withdraw from './withdraw';
export default class AppHome extends Component {
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
        } else if (this.state.currentScreen === 'trans') {
          this.setState({currentScreen: 'menu'});
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
      <TouchableOpacity
        style={style.btn}
        onPress={async () => {
          if (this.props.myTransactions) {
            await setTimeout(async () => {
              this.setState({currentScreen: 'trans'});
            }, 100);
          } else {
            this.props.openTimedSnack('Generating....');
          }
        }}>
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
    return (
      <Animatable.View animation={slideInRight} style={style.mainContent}>
        <Image
          source={require('../../../assets/drawables/logo.png')}
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
        ) : this.state.currentScreen === 'trans' ? (
          <ScrollView>
            {this.props.myTransactions.map((x, i) => {
              return x.transactionType === 'Recieved Money' ? (
                <TransactionCard
                  msg={receivedString(x)}
                  data={x}
                  st={style.receieved}
                />
              ) : x.transactionType === 'Sent Money' ? (
                <TransactionCard msg={sentString(x)} data={x} st={style.sent} />
              ) : x.transactionType.match('Token') ? (
                <TransactionCard
                  msg={tokenString(x)}
                  data={x}
                  st={style.token}
                />
              ) : x.transactionType === 'Cash Withdrawal' ? (
                <TransactionCard msg={cashString(x)} data={x} st={style.cash} />
              ) : (
                <TransactionCard
                  msg={depositString(x)}
                  data={x}
                  st={style.deposit}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View />
        )}
      </Animatable.View>
    );
  }
}
class TransactionCard extends Component {
  render() {
    ''.match();
    const x = this.props.data;
    return (
      <Animatable.View animation={slideInRight} style={this.props.st}>
        <Text style={style.text1}>Date: {x.transactionDate}</Text>
        <Text style={style.text1}>Time: {x.transactionTime}</Text>
        <Text style={style.text1}>
          Amount: {'$ ' + numberWithCommas(x.transactionAmount) + '.00'}
        </Text>
        <Text style={style.text1}>Type: {x.transactionType}</Text>
        <Text style={style.text2}>{this.props.msg}</Text>
      </Animatable.View>
    );
  }
}
