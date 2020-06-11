import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import HomeDetail from '../screens/HomeDetail';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ListYourPostScreen from '../screens/ListYourPost';
import YourPostDetail from '../screens/YourPostDetail';
import ListPostYouBookScreen from '../screens/ListPostYouBook';
import PostYouBookDetail from '../screens/PostYouBookDetail';
import AddPostScreen from '../screens/AddPostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import YourAccountScreen from '../screens/YourAccount';
import EditAccountScreen from '../screens/EditAccountScreen';
import EditPasswordAccountScreen from '../screens/EditPasswordAccountScreen';
import FeedbackScreen from '../screens/Feedback';
import AddPostScreen2 from '../screens/AddPostScreen2';
import EditPostScreen2 from '../screens/EditPostScreen2';

import {createStackNavigator} from '@react-navigation/stack';
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const ListYourPostStack = createStackNavigator();
const ListPostYouBookStack = createStackNavigator();
const YourAccountStack = createStackNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      initialRouteName: 'Home',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Overview',
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Details"
      component={HomeDetail}
      options={{
        headerTintColor: '#333',
        title: 'Chi tiết phòng',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
    <HomeStack.Screen
      name="SignIn"
      component={Login}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="SignUp"
      component={Signup}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

class ListYourPostStackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      user: null,
    };
  }
  componentWillMount() {
    this.retrieveData();
  }
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      console.log('try');
      console.log(value);
      if (value != null) {
        console.log('ngu');
        this.setState({isLogged: true, user: value});
      } else {
        console.log('ad');
        this.setState({isLogged: false, user: null});
      }
    } catch (error) {
      console.log('catch');
      return null;
    }
  };
  render() {
    const {isLogged} = this.state;
    if (isLogged === true) {
      return (
        <>
          <ListYourPostStack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#009387',
              },
              initialRouteName: 'ListYourPostScreen',
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <ListYourPostStack.Screen
              name="ListYourPostScreen"
              component={ListYourPostScreen}
              options={{
                title: 'Overview',
                headerShown: false,
              }}
            />
            <ListYourPostStack.Screen
              name="Details"
              component={YourPostDetail}
              options={{
                title: 'Chi tiết phòng',
                headerTintColor: '#333',
                headerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            />
            <ListYourPostStack.Screen
              name="AddPostScreen"
              component={AddPostScreen}
              options={{
                title: 'Thông tin mô tả',
                headerTintColor: '#333',
                headerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            />
            <ListYourPostStack.Screen
              name="AddPostScreen2"
              component={AddPostScreen2}
              options={{
                title: 'Hình ảnh',
                headerTintColor: '#333',
                headerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            />
            <ListYourPostStack.Screen
              name="EditPostScreen"
              component={EditPostScreen}
              options={{
                title: 'Thông tin mô tả',
                headerTintColor: '#333',
                headerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            />
            <ListYourPostStack.Screen
              name="EditPostScreen2"
              component={EditPostScreen2}
              options={{
                title: 'Hình ảnh',
                headerTintColor: '#333',
                headerStyle: {
                  backgroundColor: '#fff',
                },
              }}
            />
          </ListYourPostStack.Navigator>
        </>
      );
    } else {
      return (
        <>
          <ListYourPostStack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#009387',
              },
              initialRouteName: 'SignIn',
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <ListYourPostStack.Screen
              name="SignIn"
              component={Login}
              options={{
                title: 'Chi tiết phòng',
                headerShown: false,
              }}
            />
            <ListYourPostStack.Screen
              name="SignUp"
              component={Signup}
              options={{
                title: 'Chi tiết phòng',
                headerShown: false,
              }}
            />
          </ListYourPostStack.Navigator>
        </>
      );
    }
  }
}

const ListPostYouBookStackScreen = ({navigation}) => (
  <ListPostYouBookStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      initialRouteName: 'Home',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ListPostYouBookStack.Screen
      name="ListPostYouBookScreen"
      component={ListPostYouBookScreen}
      options={{
        title: 'Overview',
        headerShown: false,
      }}
    />
    <ListPostYouBookStack.Screen
      name="Details"
      component={PostYouBookDetail}
      options={{
        headerTintColor: '#333',
        title: 'Chi tiết phòng',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
    <ListPostYouBookStack.Screen
      name="SignIn"
      component={Login}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
    <ListPostYouBookStack.Screen
      name="SignUp"
      component={Signup}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
  </ListPostYouBookStack.Navigator>
);

const YourAccountStackScreen = ({navigation}) => (
  <YourAccountStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      initialRouteName: 'SignIn',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <YourAccountStack.Screen
      name="YourAccountScreen"
      component={YourAccountScreen}
      options={{
        title: 'Overview',
        headerShown: false,
      }}
    />
    <YourAccountStack.Screen
      name="EditPasswordAccountScreen"
      component={EditPasswordAccountScreen}
      options={{
        headerTintColor: '#333',
        title: 'Chỉnh sửa mật khẩu',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
    <YourAccountStack.Screen
      name="EditAccountScreen"
      component={EditAccountScreen}
      options={{
        headerTintColor: '#333',
        title: 'Chỉnh sửa tài khoản',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
    <YourAccountStack.Screen
      name="FeedbackScreen"
      component={FeedbackScreen}
      options={{
        headerTintColor: '#333',
        title: 'Phản hồi cho quản trị viên',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    />
    <ListPostYouBookStack.Screen
      name="SignIn"
      component={Login}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
    <ListPostYouBookStack.Screen
      name="Signup"
      component={Signup}
      options={{
        title: 'Chi tiết phòng',
        headerShown: false,
      }}
    />
  </YourAccountStack.Navigator>
);

export default class MyTabs extends Component {
  render() {
    return (
      <Tab.Navigator
        style={{marginBottom: 0}}
        initialRouteName="Home"
        activeColor="#e91e63"
        style={{backgroundColor: 'tomato'}}>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            //tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <Icon name="home" size={20} color="#e88a59" />
            ),
          }}
        />
        <Tab.Screen
          name="Tin của bạn"
          component={ListYourPostStackScreen}
          options={{
            //tabBarLabel: 'Updates',
            tabBarIcon: ({color}) => (
              <Icon name="newspaper-o" size={20} color="#e88a59" />
            ),
          }}
        />
        <Tab.Screen
          name="Tin bạn đặt"
          component={ListPostYouBookStackScreen}
          options={{
            //tabBarLabel: 'Updates',
            tabBarIcon: ({color}) => (
              <Icon name="inbox" size={20} color="#e88a59" />
            ),
          }}
        />
        <Tab.Screen
          name="Tài khoản"
          component={YourAccountStackScreen}
          options={{
            //tabBarLabel: 'Updates',
            tabBarIcon: ({color}) => (
              <Icon name="user" size={20} color="#e88a59" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}