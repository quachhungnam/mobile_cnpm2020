import React, {Component} from 'react';
import {Text, View, Image, ScrollView} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {SliderBox} from 'react-native-image-slider-box';

import {getPost} from '../networking/Server';
import {getRateOfPost} from '../networking/Server';

//import { Dropdown } from 'react-native-material-dropdown';

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

export default class YourPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        'https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Network image
      ],
      post: {},
      rate: [],
    };
  }

  componentDidMount() {
    this.refreshDataFromServer();
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

  render() {
    const {post, rate} = this.state;
    if (Object.keys(post).length !== 0 && rate !== undefined) {
      return (
        <ScrollView
          style={{backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={true}>
          <SliderBox images={this.state.images} />
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
              {`Giá: ${post.price} VND / tháng`}
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
                  source={require('../images/cube.png')}
                  style={{width: 30, height: 30}}
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
                  source={require('../images/question.png')}
                  style={{width: 30, height: 30}}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {post.status_id.code === 2 ? 'Đã đặt' : 'Chưa đặt'}
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Mô tả chi tiết
            </Text>
            <Text>{post.description}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Địa chỉ chi tiết
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Số nhà, Đường
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Quận / Huyện
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Tỉnh / Thành phố
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Số điện thoại liên hệ
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Ngày đăng
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
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  Người đăng
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
                this.props.navigation.navigate('EditPostScreen');
              }}>
              <Text style={{textAlign: 'center'}}>Sửa tin đăng</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                flex: 50,
                marginBottom: 20,
                marginLeft: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {}}>
              <Text style={{textAlign: 'center'}}>Xóa tin đăng</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {`Đánh giá của người dùng: ${calStarAverage(rate)}/5`}
            </Text>
            {rate.map(item => {
              return (
                <View>
                  <View style={{paddingTop: 10, flex: 1, flexDirection: 'row'}}>
                    <Text style={{marginRight: 10, fontSize: 16}}>
                      {`${item.account_id.name} đã đánh giá:`}
                    </Text>
                    <Text style={{fontSize: 16}}>{item.star}</Text>
                    <Image
                      source={require('../images/star.png')}
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

          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#fff',
                padding: 10,
                backgroundColor: '#f58908',
                marginRight: 10,
                borderRadius: 8,
              }}>
              {post.status_id.code === 0 ? 'Chưa duyệt' : 'Đã duyệt'}
            </Text>
            <Text
              style={{
                color: '#fff',
                padding: 10,
                backgroundColor: '#5eba7d',
                borderRadius: 8,
              }}>
              {post.status_id.code === 3 ? 'Đã thuê' : 'Chưa thuê'}
            </Text>
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
              {`Giá: ${post.price} VND / tháng`}
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
                  source={require('../images/cube.png')}
                  style={{width: 30, height: 30}}
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
                  source={require('../images/question.png')}
                  style={{width: 30, height: 30}}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#e88a59',
                    marginTop: 6,
                  }}>
                  {post.status_id.code === 2 ? 'Đã đặt' : 'Chưa đặt'}
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Mô tả chi tiết
            </Text>
            <Text>{post.description}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Địa chỉ chi tiết
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Số nhà, Đường
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Quận / Huyện
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
                <Text style={{textAlign: 'center', fontSize: 14}}>
                  Tỉnh / Thành phố
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Số điện thoại liên hệ
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
            <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
              Ngày đăng
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
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  Người đăng
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
                this.props.navigation.navigate('EditPostScreen');
              }}>
              <Text style={{textAlign: 'center'}}>Sửa tin đăng</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                flex: 50,
                marginBottom: 20,
                marginLeft: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#ffceb5',
              }}
              onPress={() => {}}>
              <Text style={{textAlign: 'center'}}>Xóa tin đăng</Text>
            </TouchableHighlight>
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Chưa có đánh giá nào
            </Text>
          </View>

          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#fff',
                padding: 10,
                backgroundColor: '#f58908',
                marginRight: 10,
                borderRadius: 8,
              }}>
              {post.status_id.code === 0 ? 'Chưa duyệt' : 'Đã duyệt'}
            </Text>
            <Text
              style={{
                color: '#fff',
                padding: 10,
                backgroundColor: '#5eba7d',
                borderRadius: 8,
              }}>
              {post.status_id.code === 3 ? 'Đã thuê' : 'Chưa thuê'}
            </Text>
          </View>
        </ScrollView>
      );
    }
    return <View />;
  }
}
