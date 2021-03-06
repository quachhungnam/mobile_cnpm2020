import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Linking,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {SliderBox} from 'react-native-image-slider-box';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-community/async-storage';

import {getPost} from '../api/post_api';
import {getRateOfPost, addRate} from '../api/rate_api';
import {addTransaction} from '../api/transaction_api';
import {get_account_infor} from '../api/account_api';

function formatDate(date) {
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function calStarAverage(rate) {
  const starSum = rate.reduce((sum, item) => sum + item.star, 0);
  const average = starSum / rate.length;
  let result = 0;
  if (average.toString().indexOf('.') === -1) {
    result = average;
  } else if (
    average.toString().indexOf('.') ===
    average.toString().length - 2
  ) {
    result = average.toFixed(1);
  } else {
    result = average.toFixed(2);
  }
  return result;
}

export default class HomeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        'https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Network image
      ],
      newRate: {name: '', description: '', star: 0},
      post: {},
      rate: [],
      is_login: false,
      user_infor: {},
      user_token: '',
    };
  }

  componentDidMount() {
    this.check_login();
    this.refreshDataFromServer();
  }

  onStarRatingPress(rating) {
    this.setState(prevState => ({
      newRate: {
        ...prevState.newRate,
        star: rating,
      },
    }));
  }

  refreshDataFromServer = () => {
    const {id} = this.props.route.params;
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

  check_login = async () => {
    try {
      const value_token = await AsyncStorage.getItem('user');
      if (value_token !== null) {
        this.setState({
          user_token: value_token,
        });
        this.setState({
          is_login: true,
        });
        get_account_infor(value_token)
          .then(res => {
            this.setState({
              user_infor: res.data.account,
            });
          })
          .catch(err => {
            this.setState({
              user_infor: {},
            });
          });
      }
    } catch (err) {
      this.setState({
        user_token: '',
      });
      this.setState({
        user_infor: {},
      });
      this.setState({
        is_login: false,
      });
    }
  };

  addTran = () => {
    if (this.state.is_login === true) {
      addTransaction(
        this.state.user_infor,
        this.state.user_token,
        this.props.route.params.id,
      ).then(res => {
        if (res.message === 'transaction created') {
          Alert.alert(
            'Th??ng b??o',
            '?????t th??nh c??ng',
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
          return;
        }
        if (res.error === 'transaction exist') {
          Alert.alert(
            'Th??ng b??o',
            'Tin n??y ???? c?? ch???, b???n kh??ng th??? ?????t',
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
        }
      });
    } else {
      Alert.alert(
        'Th??ng b??o',
        'B???n c???n ????ng nh???p ????? ?????t',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
    }
  };

  bookPost = () => {
    try {
      Alert.alert(
        'Th??ng b??o',
        'B???n mu???n ?????t tin n??y ch????',
        [
          {
            text: 'Kh??ng',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'C??',
            onPress: () => {
              this.addTran();
            },
          },
        ],
        {cancelable: false},
      );
    } catch (err) {
      console.error(err);
    }
  };

  sendReview = () => {
    try {
      if (this.state.is_login === true) {
        addRate(
          this.state.user_infor,
          this.state.user_token,
          this.props.route.params.id,
          this.state.newRate,
        ).then(res => {
          if (res.message === 'rate created') {
            Alert.alert(
              'Th??ng b??o',
              'C???m ??n b???n ???? ????nh gi??',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
              {cancelable: false},
            );
            return;
          }
          if (res.error) {
            Alert.alert(
              'Th??ng b??o',
              'Kh??ng th??? ????nh gi??',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
              {cancelable: false},
            );
          }
        });
      } else {
        Alert.alert(
          'Th??ng b??o',
          'B???n c???n ????ng nh???p ????? ????nh gi??',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const {post, rate} = this.state;
    if (Object.keys(post).length !== 0 && rate !== undefined) {
      return (
        <ScrollView
          style={{backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={true}>
          {/* hoat anh */}
          <SliderBox images={this.state.images} />
          {/* view 2 hang dau */}
          <View style={styles.view_2rowdau}>
            {/* tieu de post, loai post, va gia */}
            <Text style={styles.txt_posttype}>{post.post_type_id.name}</Text>
            <Text style={styles.txt_title}>{post.title}</Text>
            <Text style={styles.txt_price}>
              {`Gi??: ${post.price} VND / th??ng`}
            </Text>
            {/* view dien tich va trang thai da dat  */}
            <View style={styles.view_square_status}>
              <View style={styles.view_square}>
                <Image
                  source={require('../assets/images/cube.png')}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.txt_square}>{`${post.square} m2`}</Text>
              </View>
              <View style={styles.view_status}>
                <Image
                  source={require('../assets/images/question.png')}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.txt_square}>
                  {`${post.status_id.code === 2 ? '???? ?????t' : 'Ch??a ?????t'}`}
                </Text>
              </View>
            </View>
          </View>

          {/* view mo ta chi tiet */}
          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>M?? t??? chi ti???t</Text>
            <Text>{post.description}</Text>
          </View>
          {/* view dia chi chi tiet gom 3 phan */}
          <View style={styles.view_addressdetail}>
            <Text style={styles.txt_detail}>?????a ch??? chi ti???t</Text>
            <View style={styles.view_diachichitiet}>
              <View style={styles.view_province}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  S??? nh??, ???????ng
                </Text>
                <Text style={styles.txt_address_detail}>
                  {post.address_detail.split(',')[0]}
                </Text>
              </View>
              <View style={styles.view_province}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Qu???n / Huy???n
                </Text>
                <Text style={styles.txt_province}>{post.district_id.name}</Text>
              </View>
              <View style={styles.view_province}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  T???nh / Th??nh ph???
                </Text>
                <Text style={styles.txt_province}>{post.province_id.name}</Text>
              </View>
            </View>
          </View>
          {/* view so dien thoai lien he */}
          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>S??? ??i???n tho???i li??n h???</Text>
            <Text>{post.host_id.mobile}</Text>
          </View>
          {/* view ngay dang */}
          <View style={styles.view_datepost}>
            <Text style={styles.txt_detail}>Ng??y ????ng</Text>
            <Text>
              {post.updated_at === null
                ? formatDate(new Date(post.created_at))
                : formatDate(new Date(post.updated_at))}
            </Text>
          </View>

          {/* nguoi dang*/}
          <TouchableHighlight style={styles.touch_hostid}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text style={styles.txt_nguoidang}>Ng?????i ????ng</Text>
                <Text>{post.host_id.name}</Text>
              </View>
            </View>
          </TouchableHighlight>

          {/* dat ngauy va goi dien */}
          <View style={styles.view_bookandcall}>
            <TouchableHighlight
              disabled={this.props.route.params.statusCode === 2 ? true : false}
              underlayColor="#ffceb588"
              style={styles.touch_datngay}
              onPress={() => {
                this.bookPost();
              }}>
              <Text style={{textAlign: 'center'}}>?????t ngay</Text>
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
              <Text style={{textAlign: 'center'}}>G???i ??i???n tho???i</Text>
            </TouchableHighlight>
          </View>
          {/* danh gia cua nguoi dung */}
          <View style={{paddingHorizontal: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {`????nh gi?? c???a ng?????i d??ng: ${calStarAverage(rate)}/5`}
            </Text>
            {rate.map(item => {
              return (
                <View>
                  <View style={{paddingTop: 10, flex: 1, flexDirection: 'row'}}>
                    <Text style={{marginRight: 10, fontSize: 16}}>
                      {`${item.account_id.name} ???? ????nh gi??:`}
                    </Text>
                    <Text style={{fontSize: 16}}>{item.star}</Text>
                    <Image
                      source={require('../assets/images/star.png')}
                      style={{width: 10, height: 10}}
                    />
                  </View>
                  <Text style={{fontSize: 12, color: 'gray', marginBottom: 7}}>
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
          {/* danh gia cua ban */}
          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>????nh gi?? c???a b???n</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.newRate.star}
              emptyStar={'md-star-outline'}
              fullStar={'md-star'}
              halfStar={'md-star-half'}
              iconSet={'Ionicons'}
              selectedStar={rating => {
                this.onStarRatingPress(rating);
              }}
              fullStarColor={'#ffb600'}
            />
            <TextInput
              style={styles.input_rate}
              placeholder="Nh???p ????nh gi?? c???a b???n"
              placeholderTextColor="#333"
              onChangeText={text => {
                this.setState(prevState => ({
                  newRate: {
                    ...prevState.newRate,
                    name: text,
                    description: text,
                  },
                }));
              }}
            />
            <TouchableHighlight
              disabled={
                this.state.newRate.description !== '' &&
                this.state.newRate.star !== 0
                  ? false
                  : true
              }
              style={styles.touch_rate}
              onPress={() => {
                this.sendReview();
              }}>
              <Text style={{textAlign: 'center'}}>????nh gi??</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      );
    }

    if (Object.keys(post).length !== 0 && rate === undefined) {
      return (
        <ScrollView
          style={{backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={true}>
          <SliderBox images={this.state.images} />
          <View style={styles.view_2rowdau}>
            <Text style={styles.txt_posttype}>{post.post_type_id.name}</Text>
            <Text style={styles.txt_title}>{post.title}</Text>
            <Text style={styles.txt_price}>
              {`Gi??: ${post.price} VND / th??ng`}
            </Text>
            <View style={styles.view_square_status}>
              <View style={styles.view_img}>
                <Image
                  source={require('../assets/images/cube.png')}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.txt_square2}>{`${post.square} m2`}</Text>
              </View>
              <View style={styles.view_img}>
                <Image
                  source={require('../assets/images/question.png')}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.txt_square2}>
                  {`${post.status_id.code === 2 ? '???? ?????t' : 'Ch??a ?????t'}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>M?? t??? chi ti???t</Text>
            <Text>{post.description}</Text>
          </View>
          <View style={styles.view_diachichitiet2}>
            <Text style={styles.txt_detail}>?????a ch??? chi ti???t</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={styles.view_diachi}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  S??? nh??, ???????ng
                </Text>
                <Text style={styles.txt_province}>
                  {post.address_detail.split(',')[0]}
                </Text>
              </View>
              <View style={styles.view_diachi}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Qu???n / Huy???n
                </Text>
                <Text style={styles.txt_province}>{post.district_id.name}</Text>
              </View>
              <View style={styles.view_diachi}>
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  T???nh / Th??nh ph???
                </Text>
                <Text style={styles.txt_province}>{post.province_id.name}</Text>
              </View>
            </View>
          </View>
          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>S??? ??i???n tho???i li??n h???</Text>

            <Text>{post.host_id.mobile}</Text>
          </View>
          <View style={styles.view_ngaydang}>
            <Text style={styles.txt_detail}>Ng??y ????ng</Text>
            <Text>
              {post.updated_at === null
                ? formatDate(new Date(post.created_at))
                : formatDate(new Date(post.updated_at))}
            </Text>
          </View>
          <TouchableHighlight style={styles.touch_nguoidang}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text style={styles.txt_nguoidang}>Ng?????i ????ng</Text>
                <Text>{post.host_id.name}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.view_bookandcall}>
            <TouchableHighlight
              disabled={this.props.route.params.statusCode === 2 ? true : false}
              underlayColor="#ffceb588"
              style={styles.touch_datngay}
              onPress={() => {
                this.bookPost();
              }}>
              <Text style={{textAlign: 'center'}}>?????t ngay</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#ffceb588"
              style={styles.touch_contact}
              onPress={() => {
                Linking.openURL(`tel:${post.host_id.mobile}`);
              }}>
              <Text style={{textAlign: 'center'}}>G???i ??i???n tho???i</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.view_contact}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Ch??a c?? ????nh gi?? n??o
            </Text>
          </View>

          <View style={styles.view_contact}>
            <Text style={styles.txt_detail}>????nh gi?? c???a b???n</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.newRate.star}
              emptyStar={'md-star-outline'}
              fullStar={'md-star'}
              halfStar={'md-star-half'}
              iconSet={'Ionicons'}
              selectedStar={rating => {
                this.onStarRatingPress(rating);
              }}
              fullStarColor={'#ffb600'}
            />
            <TextInput
              style={styles.input_rate}
              placeholder="Nh???p ????nh gi?? c???a b???n"
              placeholderTextColor="#333"
              onChangeText={text => {
                this.setState(prevState => ({
                  newRate: {
                    ...prevState.newRate,
                    name: text,
                    description: text,
                  },
                }));
              }}
            />
            <TouchableHighlight
              disabled={
                this.state.newRate.description !== '' &&
                this.state.newRate.star !== 0
                  ? false
                  : true
              }
              style={styles.touch_rate}
              onPress={() => {
                this.sendReview();
              }}>
              <Text style={{textAlign: 'center'}}>????nh gi??</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      );
    }
    return <View />;
  }
}

const styles = StyleSheet.create({
  view_img: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  },
  view_diachichitiet2: {
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  view_diachi: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
  },
  txt_province: {
    textAlign: 'center',
    fontSize: 14,
    color: '#e88a59',
  },
  touch_datngay: {
    flex: 50,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffceb5',
  },
  touch_nguoidang: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  view_ngaydang: {
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  view_bookandcall: {
    flex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  txt_square2: {
    textAlign: 'center',
    color: '#e88a59',
    marginTop: 6,
  },
  view_square: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  },
  view_square_status: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  view_2rowdau: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  txt_nguoidang: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  view_datepost: {
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  view_province: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
  },
  view_addressdetail: {
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  view_contact: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  touch_hostid: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  touch_contact: {
    flex: 50,
    marginBottom: 20,
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffceb5',
  },
  touch_rate: {
    flex: 50,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffceb5',
  },
  input_rate: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 0,
  },
  txt_detail: {fontSize: 18, marginBottom: 10, fontWeight: 'bold'},
  txt_posttype: {
    color: 'gray',
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 10,
  },
  txt_title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  txt_price: {
    color: '#e88a59',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  txt_square: {
    textAlign: 'center',
    color: '#e88a59',
    marginTop: 6,
  },
  view_status: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  },
  view_diachichitiet: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt_address_detail: {
    textAlign: 'center',
    fontSize: 14,
    color: '#e88a59',
  },
});
