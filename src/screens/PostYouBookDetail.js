import React, { Component } from 'react';
import { Text, View, ScrollView, Image, Linking, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import AsyncStorage from '@react-native-community/async-storage';
import { getPost } from '../api/post_api';
import { getRateOfPost } from '../api/rate_api';
import { delTransaction } from '../api/transaction_api';
import { AuthContext } from '../navigation/MyTabs';
import { your_ip } from '../api/your_ip';

function formatDate(date) {
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function calStarAverage(rate) {
  const starSum = rate.reduce((sum, item) => sum + item.star, 0);
  return starSum / rate.length;
}

export default class PostYouBookDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      rate: [],
      user_token: '',
      img_post: [],
    };
  }

  componentDidMount() {
    this.getToken();
    this.refreshDataFromServer();
    this.set_post_img();
  }

  set_post_img = () => {
    const { post_item } = this.props.route.params;
    if (post_item.post_image.length === 0) {
      post_item.post_image.push({
        _id: new Date(),
        path: 'uploads/home.jpg',
      });
    }
    let arr_images = post_item.post_image;
    let arr_uri = [];
    for (let i = 0; i < arr_images.length; i++) {
      let uri = your_ip + '/' + arr_images[i].path;
      arr_uri.push(uri);
    }
    this.setState({ img_post: arr_uri });
    //set_img_post(arr_uri);
  };

  refreshDataFromServer = () => {
    const { id } = this.props.route.params;
    getPost(id)
      .then(post => {
        this.setState({
          post: post,
        });
      })
      .catch(error => {
        this.setState({
          post: {},
        });
      });
    getRateOfPost(id)
      .then(rate => {
        this.setState({
          rate: rate,
        });
      })
      .catch(error => {
        this.setState({
          rate: [],
        });
      });
  };

  getToken = async () => {
    try {
      const value_token = await AsyncStorage.getItem('user');
      if (value_token !== null) {
        this.setState({
          user_token: value_token,
        });
      }
    } catch (err) {
      this.setState({
        user_token: '',
      });
    }
  };

  delTran = () => {
    delTransaction(this.state.user_token, this.props.route.params.tranId).then(
      res => {
        if (res.message === 'transaction deleted') {
          Alert.alert(
            'Th??ng b??o',
            'H???y ?????t th??nh c??ng',
            [
              {
                text: 'OK',
                onPress: () => { },
              },
            ],
            { cancelable: false },
          );
          return;
        }
        if (res.error) {
          Alert.alert(
            'Th??ng b??o',
            'Tin n??y kh??ng t???n t???i',
            [
              {
                text: 'OK',
                onPress: () => { },
              },
            ],
            { cancelable: false },
          );
        }
      },
    );
  };

  delPost = () => {
    try {
      Alert.alert(
        'Th??ng b??o',
        'B???n mu???n h???y ?????t tin n??y ch????',
        [
          {
            text: 'Kh??ng',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'C??',
            onPress: () => {
              this.delTran();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { post, rate } = this.state;
    if (Object.keys(post).length !== 0 && rate !== undefined) {
      return (
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          showsVerticalScrollIndicator={true}>
          <SliderBox images={this.state.img_post} />
          <View
            style={{
              marginTop: 10,
              flex: 1,
              flexDirection: 'column',
              padding: 10,
            }}>
            <Text
              style={{
                color: 'gray',
                textTransform: 'uppercase',
                fontSize: 12,
                marginBottom: 10,
              }}>
              {post.post_type_id.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              {post.title}
            </Text>
            <Text
              style={{
                color: '#e88a59',
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              {`Gi??: ${post.price} VND / th??ng`}
            </Text>
            <View
              style={{
                paddingTop: 20,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/cube.png')}
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {`${post.square} m2`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/question.png')}
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {`${post.status_id.code === 2 ? '???? ?????t' : 'Ch??a ?????t'}`}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              M?? t??? chi ti???t
            </Text>
            <Text>{post.description}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              ?????a ch??? chi ti???t
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  S??? nh??, ???????ng
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.address_detail.split(',')[0]}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  Qu???n / Huy???n
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.district_id.name}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  T???nh / Th??nh ph???
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.province_id.name}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              S??? ??i???n tho???i li??n h???
            </Text>

            <Text>{post.host_id.mobile}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              Ng??y ????ng
            </Text>
            <Text>
              {post.updated_at === null
                ? formatDate(new Date(post.created_at))
                : formatDate(new Date(post.updated_at))}
            </Text>
          </View>
          <TouchableHighlight
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  Ng?????i ????ng
                </Text>
                <Text>{post.host_id.name}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View
            style={{
              flex: 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
              marginTop: 20,
            }}>
            <TouchableHighlight
              underlayColor="#ffceb588"
              style={{
                flex: 50,
                marginBottom: 20,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {
                this.delPost();
              }}>
              <Text style={{ textAlign: 'center' }}>H???y ?????t</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#ffceb588"
              style={{
                flex: 50,
                marginBottom: 20,
                marginLeft: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {
                Linking.openURL(`tel:${post.host_id.mobile}`);
              }}>
              <Text style={{ textAlign: 'center' }}>G???i ??i???n tho???i</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {`????nh gi?? c???a ng?????i d??ng: ${calStarAverage(rate)}/5`}
            </Text>
            {rate.map(item => {
              return (
                <View>
                  <View style={{ paddingTop: 10, flex: 1, flexDirection: 'row' }}>
                    <Text style={{ marginRight: 10, fontSize: 16 }}>
                      {`${item.account_id.name} ???? ????nh gi??:`}
                    </Text>
                    <Text style={{ fontSize: 16 }}>{item.star}</Text>
                    <Image
                      source={require('../assets/images/star.png')}
                      style={{ width: 10, height: 10 }}
                    />
                  </View>
                  <Text style={{ fontSize: 12, color: 'gray', marginBottom: 7 }}>
                    {formatDate(new Date(item.created_at))}
                  </Text>
                  <Text
                    style={{
                      paddingBottom: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: 'silver',
                    }}>
                    {item.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      );
    }
    if (Object.keys(post).length !== 0 && rate === undefined) {
      return (
        <ScrollView
          style={{ backgroundColor: '#fff' }}
          showsVerticalScrollIndicator={true}>
          <SliderBox images={this.state.img_post} />
          <View
            style={{
              marginTop: 10,
              flex: 1,
              flexDirection: 'column',
              padding: 10,
            }}>
            <Text
              style={{
                color: 'gray',
                textTransform: 'uppercase',
                fontSize: 12,
                marginBottom: 10,
              }}>
              {post.post_type_id.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              {post.title}
            </Text>
            <Text
              style={{
                color: '#e88a59',
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              {`Gi??: ${post.price} VND / th??ng`}
            </Text>
            <View
              style={{
                paddingTop: 20,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/cube.png')}
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {`${post.square} m2`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/question.png')}
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {`${post.status_id.code === 2 ? '???? ?????t' : 'Ch??a ?????t'}`}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              M?? t??? chi ti???t
            </Text>
            <Text>{post.description}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              ?????a ch??? chi ti???t
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  S??? nh??, ???????ng
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.address_detail.split(',')[0]}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  Qu???n / Huy???n
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.district_id.name}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  textAlign: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                  T???nh / Th??nh ph???
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#e88a59',
                  }}>
                  {post.province_id.name}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              S??? ??i???n tho???i li??n h???
            </Text>

            <Text>{post.host_id.mobile}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
              Ng??y ????ng
            </Text>
            <Text>
              {post.updated_at === null
                ? formatDate(new Date(post.created_at))
                : formatDate(new Date(post.updated_at))}
            </Text>
          </View>
          <TouchableHighlight
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  Ng?????i ????ng
                </Text>
                <Text>{post.host_id.name}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View
            style={{
              flex: 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
              marginTop: 20,
            }}>
            <TouchableHighlight
              underlayColor="#ffceb588"
              style={{
                flex: 50,
                marginBottom: 20,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {
                this.delPost();
              }}>
              <Text style={{ textAlign: 'center' }}>H???y ?????t</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#ffceb588"
              style={{
                flex: 50,
                marginBottom: 20,
                marginLeft: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {
                Linking.openURL(`tel:${post.host_id.mobile}`);
              }}>
              <Text style={{ textAlign: 'center' }}>G???i ??i???n tho???i</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Ch??a c?? ????nh gi?? n??o
            </Text>
          </View>
        </ScrollView>
      );
    }
    return <View />;
  }
}
