import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

const width = Dimensions.get('window').width;

const info = {username: 'a', password: 'a'};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  storeData = async user => {
    try {
      await AsyncStorage.setItem('user', user);
      alert('da lưu');
    } catch (error) {
      // Error saving data
    }
  };
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      console.log('try');
      alert(value);
      if (value != null) {
        this.setState({
          isLogged: true,
          user: value,
        });
      }
      this.setState({
        isLogged: false,
        user: null,
      });
      return value;
    } catch (error) {
      console.log('catch');
      return null;
    }
  };

  render() {
    const {navigation} = this.props;
    return (
      // vùng an toàn tránh tai thỏ trong iphone
      // StatusBar thanh giờ wifi
      // KeyboardAvoidingView: TextInput đẩy lên cùng với keyboard
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
            <View style={styles.logoContainer}>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.logo}
                  source={require('../images/logo.png')}
                />
              </View>
              <View style={styles.infoContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="#333"
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCorrect={false}
                  onSubmitEditing={() => this.refs.txtPassword.focus()}
                  onChangeText={text => this.setState({username: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#333"
                  returnKeyType="go"
                  secureTextEntry
                  autoCorrect={false}
                  ref={'txtPassword'}
                  onChangeText={text => this.setState({password: text})}
                />
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    if (
                      this.state.username === info.username &&
                      this.state.password === info.password
                    ) {
                      alert('Login successfully');
                      this.storeData(this.state.username);
                      this.retrieveData();
                    }
                  }}>
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={styles.regContainer}>
                  <Text style={styles.regText}>Bạn chưa có tài khoản?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SignUp');
                    }}>
                    <Text style={styles.regButtonText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
  },
  infoContainer: {
    width: width,
    left: 0,
    right: 0,
    bottom: 0,
    height: 236,
    paddingHorizontal: 30,
  },
  input: {
    height: 45,
    color: '#333',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    backgroundColor: '#ffceb5',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  regContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regText: {
    fontSize: 16,
    marginRight: 10,
  },
  regButtonText: {
    color: '#e88a59',
    fontSize: 16,
    fontWeight: 'bold',
  },
});