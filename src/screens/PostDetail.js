import React, { useState, useEffect } from 'react';
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
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import StarRating from 'react-native-star-rating';
import { getRateOfPost2, addRate } from '../api/rate_api';
import { addTransaction } from '../api/transaction_api';
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

export default function PostDetail(props) {
  const { token } = React.useContext(AuthContext);
  const { post_item } = props.route.params;
  const [rate, setRate] = useState([]);
  const [img_post, set_img_post] = useState(post_item.post_image);
  const [newRate, set_newRate] = useState({ name: '', description: '', star: 0 });

  useEffect(() => {
    getAllRate();
    set_post_img();
  }, []);

  const set_post_img = () => {
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
    set_img_post(arr_uri);
  };

  const onStarRatingPress = rating => {
    set_newRate(prevState => ({ ...prevState, star: rating }));
  };

  const getAllRate = async () => {
    try {
      const res = await getRateOfPost2(post_item._id);
      if (res.error) {
      } else {
        setRate(res.rate);
      }
    } catch (ex) { }
  };

  const addTran = async () => {
    try {
      const res = await addTransaction(token, post_item._id);
      //Dang nhap that bai
      if (res.success == false) {
        Alert.alert(
          'Th??ng b??o',
          'B???n c???n ????ng nh???p ????? ?????t',
          [
            {
              text: 'OK',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
      }
      //tra ve thanh cong
      else {
        //ko the dat
        if (res.error) {
          Alert.alert(
            'Th??ng b??o',
            'Tin n??y ???? c?? ch???, b???n kh??ng th??? ?????t',
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
        //dat thanh cong
        if (res.message) {
          Alert.alert(
            'Th??ng b??o',
            '?????t th??nh c??ng',
            [
              {
                text: 'OK',
                onPress: () => { },
              },
            ],
            { cancelable: false },
          );
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const bookPost = () => {
    try {
      Alert.alert(
        'Th??ng b??o',
        'B???n mu???n ?????t tin n??y ch????',
        [
          {
            text: 'Kh??ng',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'C??',
            onPress: () => {
              addTran();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const sendReview = async () => {
    try {
      const res = await addRate(token, post_item._id, newRate);
      //chua dang nhap
      if (res.success == false) {
        Alert.alert(
          'Th??ng b??o',
          'B???n c???n ????ng nh???p ????? ????nh gi??',
          [
            {
              text: 'OK',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
      } else {
        //tra ve loi
        if (res.error) {
          Alert.alert(
            'Th??ng b??o',
            'Kh??ng th??? ????nh gi??',
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
        //ok
        Alert.alert(
          'Th??ng b??o',
          'C???m ??n b???n ???? ????nh gi??',
          [
            {
              text: 'OK',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: '#fff' }}
      showsVerticalScrollIndicator={true}>
      {/* hoat anh */}
      <SliderBox images={img_post} />
      {/* view 2 hang dau */}
      <View style={styles.view_2rowdau}>
        {/* tieu de post, loai post, va gia */}
        <Text style={styles.txt_posttype}>{post_item.post_type_id.name}</Text>
        <Text style={styles.txt_title}>{post_item.title}</Text>
        <Text style={styles.txt_price}>
          {`Gi??: ${post_item.price} VND / th??ng`}
        </Text>
        {/* view dien tich va trang thai da dat  */}
        <View style={styles.view_square_status}>
          <View style={styles.view_square}>
            <Image
              source={require('../assets/images/cube.png')}
              style={{ width: 30, height: 30 }}
            />
            <Text style={styles.txt_square}>{`${post_item.square} m2`}</Text>
          </View>
          <View style={styles.view_status}>
            <Image
              source={require('../assets/images/question.png')}
              style={{ width: 30, height: 30 }}
            />
            <Text style={styles.txt_square}>
              {`${post_item.status_id.code === 2 ? '???? ?????t' : 'Ch??a ?????t'}`}
            </Text>
          </View>
        </View>
      </View>

      {/* view mo ta chi tiet */}
      <View style={styles.view_contact}>
        <Text style={styles.txt_detail}>M?? t??? chi ti???t</Text>
        <Text>{post_item.description}</Text>
      </View>
      {/* view dia chi chi tiet gom 3 phan */}
      <View style={styles.view_addressdetail}>
        <Text style={styles.txt_detail}>?????a ch??? chi ti???t</Text>
        <View style={styles.view_diachichitiet}>
          <View style={styles.view_province}>
            <Text style={{ textAlign: 'center', fontSize: 14 }}>
              S??? nh??, ???????ng
            </Text>
            <Text style={styles.txt_address_detail}>
              {post_item.address_detail.split(',')[0]}
            </Text>
          </View>
          <View style={styles.view_province}>
            <Text style={{ textAlign: 'center', fontSize: 14 }}>
              Qu???n / Huy???n
            </Text>
            <Text style={styles.txt_province}>
              {post_item.district_id.name}
            </Text>
          </View>
          <View style={styles.view_province}>
            <Text style={{ textAlign: 'center', fontSize: 14 }}>
              T???nh / Th??nh ph???
            </Text>
            <Text style={styles.txt_province}>
              {post_item.province_id.name}
            </Text>
          </View>
        </View>
      </View>
      {/* view so dien thoai lien he */}
      <View style={styles.view_contact}>
        <Text style={styles.txt_detail}>S??? ??i???n tho???i li??n h???</Text>
        <Text>{post_item.host_id.mobile}</Text>
      </View>
      {/* view ngay dang */}
      <View style={styles.view_datepost}>
        <Text style={styles.txt_detail}>Ng??y ????ng</Text>
        <Text>
          {post_item.updated_at === null
            ? formatDate(new Date(post_item.created_at))
            : formatDate(new Date(post_item.updated_at))}
        </Text>
      </View>

      {/* nguoi dang*/}
      <TouchableHighlight style={styles.touch_hostid}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.txt_nguoidang}>Ng?????i ????ng</Text>
            <Text>{post_item.host_id.name}</Text>
          </View>
        </View>
      </TouchableHighlight>

      {/* dat ngauy va goi dien */}
      <View style={styles.view_bookandcall}>
        <TouchableHighlight
          // disabled={this.props.route.params.statusCode === 2 ? true : false}
          underlayColor="#ffceb588"
          style={styles.touch_datngay}
          onPress={() => {
            bookPost();
          }}>
          <Text style={{ textAlign: 'center' }}>?????t ngay</Text>
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
            Linking.openURL(`tel:${post_item.host_id.mobile}`);
          }}>
          <Text style={{ textAlign: 'center' }}>G???i ??i???n tho???i</Text>
        </TouchableHighlight>
      </View>
      {/* danh gia cua nguoi dung */}
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {rate.length == 0 ? (
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Ch??a c?? ????nh gi?? n??o
            </Text>
          ) : (
              `????nh gi?? c???a ng?????i d??ng: ${calStarAverage(rate)}/5`
            )}
        </Text>
        {rate.length == 0 ? (
          <Text />
        ) : (
            rate.map(item => {
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
            })
          )}
      </View>
      {/* danh gia cua ban */}
      <View style={styles.view_contact}>
        <Text style={styles.txt_detail}>????nh gi?? c???a b???n</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={newRate.star}
          emptyStar={'md-star-outline'}
          fullStar={'md-star'}
          halfStar={'md-star-half'}
          iconSet={'Ionicons'}
          selectedStar={rating => {
            onStarRatingPress(rating);
          }}
          fullStarColor={'#ffb600'}
        />
        {/* nhan xet cua ban */}
        <TextInput
          style={styles.input_rate}
          placeholder="Nh???p ????nh gi?? c???a b???n"
          placeholderTextColor="#333"
          onChangeText={text => {
            set_newRate(pre => ({ ...pre, name: text, description: text }));
          }}
        />
        <TouchableHighlight
          underlayColor="palegreen"
          disabled={
            newRate.description !== '' && newRate.star !== 0 ? false : true
          }
          style={styles.touch_rate}
          onPress={() => {
            sendReview();
          }}>
          <Text style={{ textAlign: 'center' }}>????nh gi??</Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
  );
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
  txt_detail: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
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
